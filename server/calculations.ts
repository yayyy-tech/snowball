import { type RetirementPlan, type CalculatedPlan } from "@shared/schema";
import { generateCompleteRecommendations, type RiskAppetite, type GrowthPreference } from "./fundRecommendations";

const INFLATION_RATE = 0.06; // Fixed 6% inflation
const SIP_STEP_UP = 0.07; // 7% annual step-up
const CORPUS_BUFFER = 0.12; // 12% buffer
const EQUITY_RETURNS = 0.12; // 12% assumed equity returns
const DEBT_RETURNS = 0.07; // 7% assumed debt returns
const GOLD_RETURNS = 0.08; // 8% assumed gold returns
const LIFE_EXPECTANCY = 85; // Assumed life expectancy

// Indian new tax regime (2024-25 - FY 2024-25, AY 2025-26)
// Updated per Union Budget 2024
function calculateTax(annualIncome: number): number {
  // Standard deduction for salaried individuals
  const STANDARD_DEDUCTION = 75000;
  const taxableIncome = Math.max(0, annualIncome - STANDARD_DEDUCTION);
  
  let tax = 0;
  
  // Tax slabs for new regime (default from FY 2024-25)
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 700000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 20000 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 50000 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 80000 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 140000 + (taxableIncome - 1500000) * 0.30;
  }
  
  // Section 87A rebate: Full rebate if taxable income <= 7 lakhs
  if (taxableIncome <= 700000) {
    tax = 0; // Full rebate up to ₹25,000
  }
  
  // Add 4% health and education cess
  const cess = tax * 0.04;
  
  return tax + cess;
}

// Calculate asset allocation based on age and risk profile
function getAssetAllocation(currentAge: number, riskTolerance: string, preferredMix: string): { equity: number; debt: number; gold: number } {
  let baseEquity = 0;
  
  // Base allocation by age (100 - age rule)
  baseEquity = Math.max(30, 100 - currentAge);
  
  // Adjust by risk tolerance
  if (riskTolerance === 'conservative') {
    baseEquity = Math.max(20, baseEquity - 20);
  } else if (riskTolerance === 'aggressive') {
    baseEquity = Math.min(80, baseEquity + 15);
  }
  
  // Adjust by preferred mix
  if (preferredMix === 'safety') {
    baseEquity = Math.max(20, baseEquity - 15);
  } else if (preferredMix === 'growth') {
    baseEquity = Math.min(80, baseEquity + 15);
  }
  
  // Calculate debt and gold
  const gold = 10; // Fixed 10% in gold
  const debt = 100 - baseEquity - gold;
  
  return { equity: baseEquity, debt, gold };
}

// Calculate blended returns based on allocation
function getBlendedReturns(allocation: { equity: number; debt: number; gold: number }): number {
  return (allocation.equity * EQUITY_RETURNS + allocation.debt * DEBT_RETURNS + allocation.gold * GOLD_RETURNS) / 100;
}

export function calculateRetirementPlan(plan: RetirementPlan): CalculatedPlan {
  console.log('[CALC DEBUG] ===== USING FIXED SIP CALCULATION (Oct 15, 2025) =====');
  const yearsToRetirement = plan.retirementAge - plan.currentAge;
  const yearsInRetirement = LIFE_EXPECTANCY - plan.retirementAge;
  
  // Calculate monthly expense at retirement with inflation
  const monthlyExpenseAtRetirement = plan.postRetirementMonthlyExpense * Math.pow(1 + INFLATION_RATE, yearsToRetirement);
  
  // Calculate corpus needed using annuity formula
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
  // PV of growing annuity: PMT * [(1 - ((1+g)/(1+r))^n) / (r-g)]
  const r = DEBT_RETURNS;
  const g = INFLATION_RATE;
  const n = yearsInRetirement;
  
  let baseCorpusNeeded;
  if (Math.abs(r - g) < 0.0001) {
    // If r ≈ g, use simplified formula
    baseCorpusNeeded = annualExpenseAtRetirement * n / (1 + r);
  } else {
    baseCorpusNeeded = annualExpenseAtRetirement * (1 - Math.pow((1 + g) / (1 + r), n)) / (r - g);
  }
  
  const bufferAmount = baseCorpusNeeded * CORPUS_BUFFER;
  const totalCorpusNeeded = baseCorpusNeeded + bufferAmount;
  
  // Calculate current assets
  const totalAssets = (plan.realEstateValue || 0) + (plan.stocksValue || 0) + 
    (plan.mutualFundsValue || 0) + (plan.ppfEpfNps || 0) + 
    (plan.bankDeposits || 0) + (plan.goldAssets || 0);
  
  // Asset allocation
  const assetAllocation = getAssetAllocation(plan.currentAge, plan.riskTolerance, plan.preferredAssetMix);
  const blendedReturns = getBlendedReturns(assetAllocation);
  
  // Project current assets to retirement
  const projectedAssetValue = totalAssets * Math.pow(1 + blendedReturns, yearsToRetirement);
  
  // Calculate monthly savings (include spouse income if working)
  const primaryAnnualIncome = plan.monthlyIncome * 12;
  const spouseAnnualIncome = (plan.spouseWorking && plan.spouseIncome) ? plan.spouseIncome : 0;
  const totalAnnualIncome = primaryAnnualIncome + spouseAnnualIncome;
  
  const annualExpense = plan.postRetirementMonthlyExpense * 12; // Assuming current expense same as retirement
  const annualTax = calculateTax(totalAnnualIncome);
  const savingsBeforeLoan = totalAnnualIncome - annualExpense - annualTax;
  
  let monthlySavings = savingsBeforeLoan / 12;
  let loanEndYear: number | undefined;
  let additionalSavingsAfterLoan: number | undefined;
  
  // Handle loan EMI
  if (plan.hasHomeLoan && plan.homeLoanEmi && plan.homeLoanTenure) {
    monthlySavings = monthlySavings - plan.homeLoanEmi;
    loanEndYear = Math.min(plan.homeLoanTenure, yearsToRetirement);
    additionalSavingsAfterLoan = plan.homeLoanEmi;
  }
  
  // Calculate SIP with step-up using proper formula
  const gapToFill = Math.max(0, totalCorpusNeeded - projectedAssetValue);
  const monthlyRate = blendedReturns / 12;
  const annualStepUp = SIP_STEP_UP;
  
  // Calculate initial SIP amount using ANNUAL step-up with MONTHLY compounding
  // For each year: SIP payments grow monthly, but SIP amount steps up annually
  let sipAmount;
  if (gapToFill <= 0) {
    sipAmount = 0; // No SIP needed if existing assets cover the corpus
  } else {
    // Calculate the FV factor for ₹1 initial monthly SIP with annual 7% step-up and monthly compounding
    let fvFactor = 0;
    for (let year = 1; year <= yearsToRetirement; year++) {
      const sipThisYear = Math.pow(1 + annualStepUp, year - 1); // SIP amount increases each year
      
      // For this year, calculate FV of 12 monthly payments with monthly compounding
      for (let month = 1; month <= 12; month++) {
        // FIXED: Removed +1 from monthsUntilRetirement calculation to match simulation exactly
        const monthsUntilRetirement = (yearsToRetirement - year) * 12 + (12 - month);
        const growthFactor = Math.pow(1 + monthlyRate, monthsUntilRetirement);
        fvFactor += sipThisYear * growthFactor;
      }
    }
    
    // Solve for initial monthly SIP: SIP = Gap / fvFactor
    sipAmount = gapToFill / fvFactor;
    
    // Debug log to verify new calculation is active
    console.log(`[SIP CALC DEBUG] Years: ${yearsToRetirement}, Gap: ₹${(gapToFill/10000000).toFixed(2)}Cr, FV Factor: ${fvFactor.toFixed(2)}, Initial SIP: ₹${Math.round(sipAmount).toLocaleString('en-IN')}, Monthly Savings: ₹${Math.round(monthlySavings).toLocaleString('en-IN')}`);
    
    // Warn if SIP exceeds monthly savings, but only cap if it's unreasonably high
    if (sipAmount > monthlySavings) {
      console.log(`[SIP CALC WARNING] Calculated SIP (₹${Math.round(sipAmount).toLocaleString('en-IN')}) exceeds monthly savings (₹${Math.round(monthlySavings).toLocaleString('en-IN')}). User may need to increase income, reduce expenses, or extend retirement age.`);
      // Cap only if it exceeds by more than 20% (unreasonable)
      if (sipAmount > monthlySavings * 1.2) {
        sipAmount = monthlySavings;
        console.log(`[SIP CALC] Capping SIP at monthly savings amount.`);
      }
    }
    
    // Set a reasonable minimum SIP only if gap exists
    sipAmount = Math.max(500, sipAmount);
  }
  
  // Accumulation phase simulation
  const accumulationYears: { year: number; sipAmount: number; yearEndValue: number }[] = [];
  let currentSip = sipAmount;
  let portfolioValue = totalAssets;
  
  for (let year = 1; year <= yearsToRetirement; year++) {
    // Check if loan ends this year
    if (loanEndYear && year === loanEndYear + 1) {
      currentSip += additionalSavingsAfterLoan!;
    }
    
    // Calculate year-end value
    for (let month = 1; month <= 12; month++) {
      portfolioValue = portfolioValue * (1 + monthlyRate) + currentSip;
    }
    
    accumulationYears.push({
      year: plan.currentAge + year,
      sipAmount: Math.round(currentSip),
      yearEndValue: Math.round(portfolioValue),
    });
    
    // Step up SIP by 7%
    currentSip = currentSip * (1 + SIP_STEP_UP);
  }
  
  const projectedSipValue = portfolioValue;
  
  // Verification log: Check if accumulated value meets target
  const accumulatedVsTarget = (projectedSipValue / totalCorpusNeeded) * 100;
  console.log(`[VERIFICATION] Target Corpus: ₹${(totalCorpusNeeded/10000000).toFixed(2)}Cr, Accumulated: ₹${(projectedSipValue/10000000).toFixed(2)}Cr, Achievement: ${accumulatedVsTarget.toFixed(1)}%`);
  
  // Withdrawal phase (SWP)
  const swpMonthlyWithdrawal = monthlyExpenseAtRetirement;
  const withdrawalYears: { year: number; withdrawal: number; balance: number }[] = [];
  let retirementCorpus = projectedSipValue;
  let monthlyWithdrawal = swpMonthlyWithdrawal;
  
  for (let year = 1; year <= yearsInRetirement; year++) {
    const annualWithdrawal = monthlyWithdrawal * 12;
    
    // Calculate year-end balance
    retirementCorpus = retirementCorpus * (1 + DEBT_RETURNS) - annualWithdrawal;
    
    withdrawalYears.push({
      year: plan.retirementAge + year,
      withdrawal: Math.round(monthlyWithdrawal),
      balance: Math.round(Math.max(0, retirementCorpus)),
    });
    
    // Increase withdrawal by inflation
    monthlyWithdrawal = monthlyWithdrawal * (1 + INFLATION_RATE);
    
    if (retirementCorpus <= 0) break;
  }
  
  // Investment recommendations using dynamic fund engine
  const investmentRecommendations = getDynamicInvestmentRecommendations(
    assetAllocation, 
    plan.riskTolerance,
    plan.currentAge,
    yearsToRetirement,
    sipAmount,
    plan.retirementLifestyle,
    plan.retirementAge,
    plan.postRetirementMonthlyExpense
  );
  
  return {
    yearsToRetirement,
    yearsInRetirement,
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    baseCorpusNeeded: Math.round(baseCorpusNeeded),
    bufferAmount: Math.round(bufferAmount),
    totalCorpusNeeded: Math.round(totalCorpusNeeded),
    totalAssets,
    projectedAssetValue: Math.round(projectedAssetValue),
    monthlySavings: Math.round(monthlySavings),
    sipAmount: Math.round(sipAmount),
    projectedSipValue: Math.round(projectedSipValue),
    accumulationYears,
    annualTax: Math.round(annualTax),
    monthlySavingsAfterTax: Math.round(monthlySavings),
    swpMonthlyWithdrawal: Math.round(swpMonthlyWithdrawal),
    withdrawalYears,
    loanEndYear,
    additionalSavingsAfterLoan: additionalSavingsAfterLoan ? Math.round(additionalSavingsAfterLoan) : undefined,
    assetAllocation,
    investmentRecommendations,
  };
}

// New dynamic investment recommendations using fund engine
function getDynamicInvestmentRecommendations(
  allocation: { equity: number; debt: number; gold: number},
  riskTolerance: string,
  currentAge: number,
  yearsToRetirement: number,
  sipAmount: number,
  lifestyle: string,
  retirementAge: number,
  monthlyExpenses: number
) {
  // Validate and map risk tolerance to RiskAppetite type
  const validRiskValues = ["conservative", "moderate", "aggressive"];
  const normalizedRisk = riskTolerance.toLowerCase();
  if (!validRiskValues.includes(normalizedRisk)) {
    throw new Error(`Invalid risk tolerance: ${riskTolerance}. Must be conservative, moderate, or aggressive.`);
  }
  const riskAppetite = normalizedRisk as RiskAppetite;

  // Determine growth preference based on ALL factors
  let growthPreference: GrowthPreference = "balanced";
  
  // Factor in lifestyle (fixing luxury vs luxurious inconsistency)
  if (lifestyle === "luxury" || lifestyle === "luxurious" || lifestyle === "comfortable") {
    growthPreference = "high_growth";
  } else if (lifestyle === "basic") {
    growthPreference = "stable";
  }
  
  // Factor in age and time horizon
  if (currentAge >= 50 || yearsToRetirement < 10) {
    growthPreference = "stable"; // Override for near-retirement
  } else if (currentAge < 35 && yearsToRetirement > 20) {
    growthPreference = "high_growth"; // Young with long horizon
  }
  
  // Factor in monthly expenses relative to SIP (investment capacity)
  if (monthlyExpenses && sipAmount) {
    const savingsRate = sipAmount / (monthlyExpenses + sipAmount);
    if (savingsRate > 0.5) {
      // High savings rate - can afford more growth
      if (growthPreference !== "stable") growthPreference = "high_growth";
    }
  }

  // Calculate equity and debt amounts based on SIP and allocation
  const monthlyInvestment = sipAmount;
  const equityAmount = monthlyInvestment * (allocation.equity / 100);
  const debtAmount = monthlyInvestment * (allocation.debt / 100);

  // Generate fund recommendations using our dynamic engine with full context
  const fundRecs = generateCompleteRecommendations(
    riskAppetite,
    equityAmount * yearsToRetirement * 12, // Total equity investment over period
    debtAmount * yearsToRetirement * 12, // Total debt investment over period
    growthPreference,
    currentAge,
    retirementAge,
    lifestyle,
    monthlyExpenses
  );

  const recommendations = [];

  // Map equity recommendations - distribute allocation among funds
  if (allocation.equity > 0 && fundRecs.equity.recommendedFunds.length > 0) {
    const equityFunds = fundRecs.equity.recommendedFunds;
    const totalEquityAllocation = allocation.equity;
    
    recommendations.push({
      category: "Equity Mutual Funds",
      instruments: equityFunds.map((fund, index) => {
        // Calculate individual fund allocation as percentage of total equity
        const fundAllocationPct = (fund.allocationAmount / equityFunds.reduce((sum, f) => sum + f.allocationAmount, 0)) * totalEquityAllocation;
        
        return {
          name: fund.fundName,
          type: fund.category,
          allocation: Math.round(fundAllocationPct * 100) / 100, // Round to 2 decimals
          returns: fund.returns5Y,
          risk: fund.risk,
          reason: fund.reasoning
        };
      })
    });
  }

  // Map debt recommendations - distribute allocation among funds
  if (allocation.debt > 0 && fundRecs.debt.recommendedFunds.length > 0) {
    const debtFunds = fundRecs.debt.recommendedFunds;
    const totalDebtAllocation = allocation.debt;
    
    recommendations.push({
      category: "Debt Funds & Bonds",
      instruments: debtFunds.map((fund, index) => {
        // Calculate individual fund allocation as percentage of total debt
        const fundAllocationPct = (fund.allocationAmount / debtFunds.reduce((sum, f) => sum + f.allocationAmount, 0)) * totalDebtAllocation;
        
        return {
          name: fund.fundName,
          type: fund.category,
          allocation: Math.round(fundAllocationPct * 100) / 100, // Round to 2 decimals
          returns: fund.returns5Y,
          risk: fund.risk,
          reason: fund.reasoning
        };
      })
    });
  }

  // Add gold recommendations
  if (allocation.gold > 0) {
    recommendations.push({
      category: "Gold & Alternative Assets",
      instruments: [{
        name: "Nippon India Gold Savings Fund",
        type: "Gold Fund",
        allocation: Math.round(allocation.gold * 0.60),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Portfolio insurance against market volatility and inflation"
      }, {
        name: "HDFC Gold Fund",
        type: "Gold Fund",
        allocation: Math.round(allocation.gold * 0.40),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Diversified gold exposure for rupee depreciation hedge"
      }]
    });
  }

  return recommendations;
}

// Legacy hardcoded recommendations (kept for reference)
function getInvestmentRecommendations(
  allocation: { equity: number; debt: number; gold: number }, 
  riskTolerance: string,
  currentAge: number,
  yearsToRetirement: number,
  sipAmount: number,
  lifestyle: string
) {
  const recommendations = [];
  
  // Determine user profile for personalization
  const isYoung = currentAge < 35;
  const isMiddleAged = currentAge >= 35 && currentAge < 50;
  const isNearRetirement = currentAge >= 50;
  const longHorizon = yearsToRetirement > 20;
  const mediumHorizon = yearsToRetirement >= 10 && yearsToRetirement <= 20;
  const shortHorizon = yearsToRetirement < 10;
  const smallInvestor = sipAmount < 10000;
  const mediumInvestor = sipAmount >= 10000 && sipAmount < 50000;
  const largeInvestor = sipAmount >= 50000;
  const luxuryLifestyle = lifestyle === 'luxurious';
  const basicLifestyle = lifestyle === 'basic';
  
  // Equity recommendations - truly personalized based on ALL factors
  if (allocation.equity > 0) {
    const equityFunds = [];
    
    // Primary fund selection based on ALL factors - age, risk, lifestyle, SIP, horizon
    if (riskTolerance === 'aggressive') {
      if (luxuryLifestyle) {
        if (longHorizon) {
          // Luxury + long horizon = maximum growth
          equityFunds.push({
            name: "Quant Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.45),
            returns: "15-20%",
            risk: 'Very High',
            reason: `Aggressive growth essential for luxurious retirement in ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "Nippon India Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.35),
            returns: "14-19%",
            risk: 'Very High',
            reason: "Diversified small-cap for high-growth lifestyle"
          });
          equityFunds.push({
            name: "Motilal Oswal Midcap Fund",
            type: "Mid Cap",
            allocation: Math.round(allocation.equity * 0.20),
            returns: "14-18%",
            risk: 'High',
            reason: "Quality midcaps for wealth building"
          });
        } else {
          // Luxury + medium/short horizon = growth + quality
          equityFunds.push({
            name: "Axis Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.40),
            returns: "15-20%",
            risk: 'Very High',
            reason: `High returns needed for luxury lifestyle in ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "Parag Parikh Flexi Cap Fund",
            type: "Flexi Cap",
            allocation: Math.round(allocation.equity * 0.35),
            returns: "13-16%",
            risk: 'High',
            reason: "Global diversification for lifestyle goals"
          });
          equityFunds.push({
            name: "Kotak Bluechip Fund",
            type: "Large Cap",
            allocation: Math.round(allocation.equity * 0.25),
            returns: "11-14%",
            risk: 'Medium',
            reason: "Quality anchor for portfolio"
          });
        }
      } else if (smallInvestor) {
        if (isYoung) {
          // Young small investor aggressive
          equityFunds.push({
            name: "Parag Parikh Flexi Cap Fund",
            type: "Flexi Cap",
            allocation: Math.round(allocation.equity * 0.60),
            returns: "13-16%",
            risk: 'High',
            reason: `All-in-one growth for ₹${Math.round(sipAmount/1000)}K SIP over ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "HDFC Index Fund - Nifty 50",
            type: "Index Fund",
            allocation: Math.round(allocation.equity * 0.40),
            returns: "11-13%",
            risk: 'Medium',
            reason: "Low-cost core for small portfolio"
          });
        } else {
          // Older small investor aggressive
          equityFunds.push({
            name: "Axis Midcap Fund",
            type: "Mid Cap",
            allocation: Math.round(allocation.equity * 0.55),
            returns: "13-16%",
            risk: 'High',
            reason: `Growth focus for ₹${Math.round(sipAmount/1000)}K monthly investment`
          });
          equityFunds.push({
            name: "UTI Nifty Index Fund",
            type: "Index Fund",
            allocation: Math.round(allocation.equity * 0.45),
            returns: "11-13%",
            risk: 'Medium',
            reason: "Stability component for aggressive portfolio"
          });
        }
      } else if (largeInvestor) {
        if (longHorizon) {
          // Large SIP + long horizon aggressive
          equityFunds.push({
            name: "Quant Active Fund",
            type: "Multi Cap",
            allocation: Math.round(allocation.equity * 0.40),
            returns: "14-19%",
            risk: 'Very High',
            reason: `Premium aggressive fund for ₹${Math.round(sipAmount/1000)}K monthly SIP`
          });
          equityFunds.push({
            name: "SBI Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.35),
            returns: "15-20%",
            risk: 'Very High',
            reason: "Small-cap exposure for large investors"
          });
          equityFunds.push({
            name: "Nippon India Multi Cap Fund",
            type: "Multi Cap",
            allocation: Math.round(allocation.equity * 0.25),
            returns: "13-17%",
            risk: 'High',
            reason: "Diversified multi-cap component"
          });
        } else {
          // Large SIP + medium/short horizon aggressive
          equityFunds.push({
            name: "ICICI Prudential Midcap Fund",
            type: "Mid Cap",
            allocation: Math.round(allocation.equity * 0.45),
            returns: "13-17%",
            risk: 'High',
            reason: `Quality midcap for ₹${Math.round(sipAmount/1000)}K investment over ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "Mirae Asset Large Cap Fund",
            type: "Large Cap",
            allocation: Math.round(allocation.equity * 0.30),
            returns: "11-14%",
            risk: 'Medium',
            reason: "Large-cap stability for shorter timeline"
          });
          equityFunds.push({
            name: "DSP Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.25),
            returns: "14-19%",
            risk: 'Very High',
            reason: "Growth kicker for aggressive returns"
          });
        }
      } else {
        // Medium investor aggressive
        if (longHorizon) {
          equityFunds.push({
            name: "Motilal Oswal Midcap Fund",
            type: "Mid Cap",
            allocation: Math.round(allocation.equity * 0.40),
            returns: "14-18%",
            risk: 'High',
            reason: `Midcap growth for ${lifestyle} retirement over ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "Axis Small Cap Fund",
            type: "Small Cap",
            allocation: Math.round(allocation.equity * 0.35),
            returns: "15-20%",
            risk: 'Very High',
            reason: "Small-cap alpha with long runway"
          });
          equityFunds.push({
            name: "Kotak Emerging Equity Fund",
            type: "Multi Cap",
            allocation: Math.round(allocation.equity * 0.25),
            returns: "13-17%",
            risk: 'High',
            reason: "Multi-cap flexibility"
          });
        } else {
          equityFunds.push({
            name: "Axis Focused 25 Fund",
            type: "Focused",
            allocation: Math.round(allocation.equity * 0.45),
            returns: "13-17%",
            risk: 'High',
            reason: `Concentrated bets for ${lifestyle} goals in ${yearsToRetirement} years`
          });
          equityFunds.push({
            name: "Invesco India Midcap Fund",
            type: "Mid Cap",
            allocation: Math.round(allocation.equity * 0.30),
            returns: "13-16%",
            risk: 'High',
            reason: "Quality midcap allocation"
          });
          equityFunds.push({
            name: "Canara Robeco Bluechip Equity",
            type: "Large Cap",
            allocation: Math.round(allocation.equity * 0.25),
            returns: "11-14%",
            risk: 'Medium',
            reason: "Large-cap anchor"
          });
        }
      }
    } else if (riskTolerance === 'moderate') {
      if (largeInvestor) {
        // Large SIP moderate - premium diversified funds
        equityFunds.push({
          name: "ICICI Prudential Equity & Debt Fund",
          type: "Hybrid",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "11-14%",
          risk: 'Medium',
          reason: `Premium balanced fund for your ₹${Math.round(sipAmount/1000)}K monthly investment`
        });
        equityFunds.push({
          name: "Mirae Asset Large Cap Fund",
          type: "Large Cap",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "11-14%",
          risk: 'Medium',
          reason: "Quality large-cap for wealth preservation"
        });
        equityFunds.push({
          name: "Parag Parikh Flexi Cap Fund",
          type: "Flexi Cap",
          allocation: Math.round(allocation.equity * 0.30),
          returns: "12-15%",
          risk: 'Medium',
          reason: "International diversification component"
        });
      } else if (isYoung && !basicLifestyle) {
        // Young moderate with growth aspirations
        equityFunds.push({
          name: "Canara Robeco Bluechip Equity Fund",
          type: "Large Cap",
          allocation: Math.round(allocation.equity * 0.45),
          returns: "11-14%",
          risk: 'Medium',
          reason: `Stable growth for your ${lifestyle} retirement aspirations`
        });
        equityFunds.push({
          name: "Axis Midcap Fund",
          type: "Mid Cap",
          allocation: Math.round(allocation.equity * 0.30),
          returns: "13-16%",
          risk: 'High',
          reason: `Growth kicker with ${yearsToRetirement} years to compound`
        });
        equityFunds.push({
          name: "UTI Nifty Index Fund",
          type: "Index Fund",
          allocation: Math.round(allocation.equity * 0.25),
          returns: "11-13%",
          risk: 'Medium',
          reason: "Low-cost market returns base"
        });
      } else {
        // Standard moderate
        equityFunds.push({
          name: "HDFC Balanced Advantage Fund",
          type: "Hybrid",
          allocation: Math.round(allocation.equity * 0.40),
          returns: "10-13%",
          risk: 'Low-Medium',
          reason: `Auto-balanced allocation for your ${lifestyle} lifestyle goals`
        });
        equityFunds.push({
          name: "SBI Bluechip Fund",
          type: "Large Cap",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "11-13%",
          risk: 'Medium',
          reason: "Large-cap stability with growth potential"
        });
        equityFunds.push({
          name: "ICICI Prudential Value Discovery Fund",
          type: "Value Fund",
          allocation: Math.round(allocation.equity * 0.25),
          returns: "11-14%",
          risk: 'Medium',
          reason: "Value investing for consistent returns"
        });
      }
    } else { // Conservative
      if (isNearRetirement || shortHorizon) {
        // Near retirement conservative - maximum safety
        equityFunds.push({
          name: "HDFC Hybrid Debt Fund",
          type: "Hybrid",
          allocation: Math.round(allocation.equity * 0.50),
          returns: "9-11%",
          risk: 'Low',
          reason: `Capital protection priority with only ${yearsToRetirement} years to retirement`
        });
        equityFunds.push({
          name: "UTI Nifty 50 Index Fund",
          type: "Index Fund",
          allocation: Math.round(allocation.equity * 0.50),
          returns: "11-13%",
          risk: 'Medium',
          reason: "Safe index exposure as retirement approaches"
        });
      } else if (smallInvestor) {
        // Small SIP conservative - simple safe funds
        equityFunds.push({
          name: "HDFC Index Fund - Sensex",
          type: "Index Fund",
          allocation: Math.round(allocation.equity * 0.70),
          returns: "11-13%",
          risk: 'Medium',
          reason: `Low-cost safe investment for ₹${Math.round(sipAmount/1000)}K monthly SIP`
        });
        equityFunds.push({
          name: "SBI Equity Hybrid Fund",
          type: "Hybrid",
          allocation: Math.round(allocation.equity * 0.30),
          returns: "10-12%",
          risk: 'Low-Medium',
          reason: "Built-in debt cushion for conservative approach"
        });
      } else {
        // Standard conservative
        equityFunds.push({
          name: "ICICI Prudential Bluechip Fund",
          type: "Large Cap",
          allocation: Math.round(allocation.equity * 0.40),
          returns: "10-13%",
          risk: 'Medium',
          reason: `Established companies for your ${lifestyle} retirement security`
        });
        equityFunds.push({
          name: "Aditya Birla Sun Life Equity Hybrid 95 Fund",
          type: "Hybrid",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "10-12%",
          risk: 'Low-Medium',
          reason: "Tax-efficient hybrid with safety focus"
        });
        equityFunds.push({
          name: "HDFC Index Fund - Nifty 50",
          type: "Index Fund",
          allocation: Math.round(allocation.equity * 0.25),
          returns: "11-13%",
          risk: 'Medium',
          reason: "Passive core for conservative portfolio"
        });
      }
    }
    
    recommendations.push({
      category: "Equity Mutual Funds",
      instruments: equityFunds,
    });
  }
  
  // Debt recommendations - personalized based on ALL factors
  if (allocation.debt > 0) {
    const debtFunds = [];
    
    if (shortHorizon || isNearRetirement) {
      if (largeInvestor) {
        // Large investor near retirement - premium safety products
        debtFunds.push({
          name: "HDFC Short Term Debt Fund",
          type: "Short Duration",
          allocation: Math.round(allocation.debt * 0.40),
          returns: "7-7.5%",
          risk: 'Very Low',
          reason: `Premium short-duration fund for your ₹${Math.round(sipAmount/1000)}K investment near retirement`
        });
        debtFunds.push({
          name: "ICICI Prudential Banking & PSU Debt Fund",
          type: "Banking & PSU",
          allocation: Math.round(allocation.debt * 0.35),
          returns: "7-7.5%",
          risk: 'Very Low',
          reason: "AAA-rated safety as retirement approaches"
        });
        debtFunds.push({
          name: "SBI Fixed Deposit (3-5 years)",
          type: "Bank FD",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "6.5-7%",
          risk: 'Very Low',
          reason: "Guaranteed returns for wealth preservation"
        });
      } else if (luxuryLifestyle) {
        // Luxury lifestyle short horizon - need better returns
        debtFunds.push({
          name: "ICICI Prudential Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.45),
          returns: "7-8%",
          risk: 'Low',
          reason: `Higher yields essential for your luxurious retirement in ${yearsToRetirement} years`
        });
        debtFunds.push({
          name: "Aditya Birla Sun Life Medium Term Plan",
          type: "Medium Duration",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "7-8%",
          risk: 'Low',
          reason: "Optimized duration for lifestyle goals"
        });
        debtFunds.push({
          name: "Kotak Bond Short Term Fund",
          type: "Short Duration",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "6.5-7.5%",
          risk: 'Low',
          reason: "Short-term safety component"
        });
      } else {
        // Standard near retirement
        debtFunds.push({
          name: "ICICI Prudential Banking & PSU Debt Fund",
          type: "Banking & PSU",
          allocation: Math.round(allocation.debt * 0.45),
          returns: "7-7.5%",
          risk: 'Very Low',
          reason: `Capital protection priority for ${lifestyle} retirement in ${yearsToRetirement} years`
        });
        debtFunds.push({
          name: "SBI Magnum Ultra Short Duration Fund",
          type: "Ultra Short Duration",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "6.5-7%",
          risk: 'Very Low',
          reason: "Liquidity for rebalancing near retirement"
        });
        debtFunds.push({
          name: "HDFC Money Market Fund",
          type: "Liquid",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "6-6.5%",
          risk: 'Very Low',
          reason: "Emergency fund parking"
        });
      }
    } else if (mediumHorizon) {
      if (riskTolerance === 'aggressive' || luxuryLifestyle) {
        // Medium horizon aggressive - can take more credit risk
        debtFunds.push({
          name: "HDFC Credit Risk Debt Fund",
          type: "Credit Risk",
          allocation: Math.round(allocation.debt * 0.40),
          returns: "8-9%",
          risk: 'Medium',
          reason: `Extra yield for ${lifestyle} goals with ${yearsToRetirement}-year cushion`
        });
        debtFunds.push({
          name: "Aditya Birla Sun Life Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.35),
          returns: "7.5-8.5%",
          risk: 'Low',
          reason: "Quality corporates for consistent returns"
        });
        debtFunds.push({
          name: "ICICI Prudential Medium Term Bond Fund",
          type: "Medium Duration",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "7-8%",
          risk: 'Low',
          reason: "Duration play for interest rate cycles"
        });
      } else if (smallInvestor) {
        // Small investor medium horizon - simple reliable funds
        debtFunds.push({
          name: "SBI Magnum Income Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.60),
          returns: "7-8%",
          risk: 'Low',
          reason: `All-in-one debt solution for ₹${Math.round(sipAmount/1000)}K monthly investment`
        });
        debtFunds.push({
          name: "UTI Bond Fund",
          type: "Medium Duration",
          allocation: Math.round(allocation.debt * 0.40),
          returns: "7-7.5%",
          risk: 'Low',
          reason: "Reliable debt fund for small investors"
        });
      } else {
        // Standard medium horizon
        debtFunds.push({
          name: "ICICI Prudential Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.45),
          returns: "7-8%",
          risk: 'Low',
          reason: `Balanced debt strategy for ${lifestyle} retirement over ${yearsToRetirement} years`
        });
        debtFunds.push({
          name: "HDFC Dynamic Bond Fund",
          type: "Dynamic Bond",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "7-9%",
          risk: 'Low',
          reason: "Professional rate management for optimal returns"
        });
        debtFunds.push({
          name: "Nippon India Gilt Securities Fund",
          type: "Gilt Fund",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "6.5-8%",
          risk: 'Low',
          reason: "Government security safety net"
        });
      }
    } else { // Long horizon
      if (luxuryLifestyle || largeInvestor) {
        // Long horizon luxury/large - maximize debt returns
        debtFunds.push({
          name: "Franklin India Credit Risk Fund",
          type: "Credit Risk",
          allocation: Math.round(allocation.debt * 0.45),
          returns: "8-10%",
          risk: 'Medium',
          reason: `Long runway allows credit risk for your ${lifestyle} retirement goals`
        });
        debtFunds.push({
          name: "L&T Triple Ace Bond Fund",
          type: "Dynamic Bond",
          allocation: Math.round(allocation.debt * 0.35),
          returns: "7.5-9%",
          risk: 'Low-Medium',
          reason: "Active long-duration strategy for wealth building"
        });
        debtFunds.push({
          name: "IDFC Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.20),
          returns: "7-8%",
          risk: 'Low',
          reason: "High-quality bond base"
        });
      } else if (smallInvestor) {
        // Small investor long horizon - keep it simple
        debtFunds.push({
          name: "SBI Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.70),
          returns: "7-8%",
          risk: 'Low',
          reason: `Simple corporate bond fund for ₹${Math.round(sipAmount/1000)}K SIP over ${yearsToRetirement} years`
        });
        debtFunds.push({
          name: "HDFC Short Term Debt Fund",
          type: "Short Duration",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "6.5-7.5%",
          risk: 'Very Low',
          reason: "Stability component for small portfolio"
        });
      } else {
        // Standard long horizon
        debtFunds.push({
          name: "Aditya Birla Sun Life Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.45),
          returns: "7.5-8.5%",
          risk: 'Low',
          reason: `Corporate yields over your ${yearsToRetirement}-year investment journey`
        });
        debtFunds.push({
          name: "HDFC Credit Risk Debt Fund",
          type: "Credit Risk",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "8-9%",
          risk: 'Medium',
          reason: "Time to benefit from credit spread investing"
        });
        debtFunds.push({
          name: "Axis Dynamic Bond Fund",
          type: "Dynamic Bond",
          allocation: Math.round(allocation.debt * 0.25),
          returns: "7-9%",
          risk: 'Low',
          reason: "Active duration for rate cycle management"
        });
      }
    }
    
    recommendations.push({
      category: "Debt & Fixed Income",
      instruments: debtFunds,
    });
  }
  
  // Gold recommendations - personalized based on investment size
  if (allocation.gold > 0) {
    const goldFunds = [];
    
    if (smallInvestor) {
      goldFunds.push({
        name: "SBI Gold ETF",
        type: "Gold ETF",
        allocation: Math.round(allocation.gold * 0.70),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Low-cost ETF perfect for small investors building gold exposure"
      });
      goldFunds.push({
        name: "ICICI Prudential Gold ETF",
        type: "Gold ETF",
        allocation: Math.round(allocation.gold * 0.30),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Diversify across gold ETFs to reduce tracking error"
      });
    } else if (largeInvestor) {
      goldFunds.push({
        name: "HDFC Gold Fund",
        type: "Gold Fund",
        allocation: Math.round(allocation.gold * 0.50),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Actively managed gold fund for sophisticated investors"
      });
      goldFunds.push({
        name: "SBI Gold ETF",
        type: "Gold ETF",
        allocation: Math.round(allocation.gold * 0.30),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Core gold ETF holding for portfolio hedge"
      });
      goldFunds.push({
        name: "Sovereign Gold Bonds (SGB)",
        type: "Government Bond",
        allocation: Math.round(allocation.gold * 0.20),
        returns: "8.5-10.5%",
        risk: 'Low',
        reason: "Government-backed with 2.5% additional interest for large investors"
      });
    } else {
      goldFunds.push({
        name: "SBI Gold ETF",
        type: "Gold ETF",
        allocation: Math.round(allocation.gold * 0.60),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Portfolio insurance against market volatility and inflation"
      });
      goldFunds.push({
        name: "HDFC Gold Fund",
        type: "Gold Fund",
        allocation: Math.round(allocation.gold * 0.40),
        returns: "8-10%",
        risk: 'Medium',
        reason: "Diversified gold exposure for rupee depreciation hedge"
      });
    }
    
    recommendations.push({
      category: "Gold & Alternative Assets",
      instruments: goldFunds,
    });
  }
  
  return recommendations;
}
