import { type RetirementPlan } from "@shared/schema";

interface CalculatedPlan {
  // Basic info
  yearsToRetirement: number;
  yearsInRetirement: number;
  
  // Corpus calculations
  monthlyExpenseAtRetirement: number;
  baseCorpusNeeded: number;
  bufferAmount: number; // 12% buffer for unexpected expenses
  totalCorpusNeeded: number;
  
  // Current assets
  totalAssets: number;
  projectedAssetValue: number;
  
  // SIP calculations
  monthlySavings: number;
  sipAmount: number;
  projectedSipValue: number;
  
  // Accumulation phase
  accumulationYears: { year: number; sipAmount: number; yearEndValue: number }[];
  
  // Tax calculations
  annualTax: number;
  monthlySavingsAfterTax: number;
  
  // Withdrawal phase
  swpMonthlyWithdrawal: number;
  withdrawalYears: { year: number; withdrawal: number; balance: number }[];
  
  // Loan handling
  loanEndYear?: number;
  additionalSavingsAfterLoan?: number;
  
  // Recommendations
  assetAllocation: { equity: number; debt: number; gold: number };
  investmentRecommendations: {
    category: string;
    instruments: {
      name: string;
      type: string;
      allocation: number;
      returns: string;
      risk: string;
    }[];
  }[];
}

const INFLATION_RATE = 0.06; // Fixed 6% inflation
const SIP_STEP_UP = 0.07; // 7% annual step-up
const CORPUS_BUFFER = 0.12; // 12% buffer
const EQUITY_RETURNS = 0.12; // 12% assumed equity returns
const DEBT_RETURNS = 0.07; // 7% assumed debt returns
const GOLD_RETURNS = 0.08; // 8% assumed gold returns
const LIFE_EXPECTANCY = 85; // Assumed life expectancy

// Indian new tax regime (2024-25)
function calculateTax(annualIncome: number): number {
  let tax = 0;
  
  if (annualIncome <= 300000) {
    tax = 0;
  } else if (annualIncome <= 600000) {
    tax = (annualIncome - 300000) * 0.05;
  } else if (annualIncome <= 900000) {
    tax = 15000 + (annualIncome - 600000) * 0.10;
  } else if (annualIncome <= 1200000) {
    tax = 45000 + (annualIncome - 900000) * 0.15;
  } else if (annualIncome <= 1500000) {
    tax = 90000 + (annualIncome - 1200000) * 0.20;
  } else {
    tax = 150000 + (annualIncome - 1500000) * 0.30;
  }
  
  return tax;
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
  
  // Calculate monthly savings
  const annualIncome = plan.monthlyIncome * 12 + (plan.annualBonus || 0) + (plan.otherIncome || 0);
  const annualExpense = plan.postRetirementMonthlyExpense * 12; // Assuming current expense same as retirement
  const annualTax = calculateTax(annualIncome);
  const savingsBeforeLoan = annualIncome - annualExpense - annualTax;
  
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
  
  // Calculate initial SIP amount using step-up SIP formula
  // FV = P * [((1+r)^n - (1+g)^n) / (r-g)] where P is initial SIP
  let sipAmount;
  if (gapToFill <= 0) {
    sipAmount = 1000; // Minimum SIP
  } else {
    const totalMonths = yearsToRetirement * 12;
    const stepUpMonthlyRate = Math.pow(1 + annualStepUp, 1/12) - 1;
    
    if (Math.abs(monthlyRate - stepUpMonthlyRate) < 0.0001) {
      sipAmount = gapToFill / (totalMonths * Math.pow(1 + monthlyRate, totalMonths/2));
    } else {
      const numerator = Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + stepUpMonthlyRate, totalMonths);
      const denominator = (monthlyRate - stepUpMonthlyRate) * Math.pow(1 + monthlyRate, totalMonths);
      sipAmount = gapToFill / (numerator / denominator);
    }
    
    // Ensure SIP is reasonable
    sipAmount = Math.max(1000, Math.min(sipAmount, monthlySavings * 0.9));
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
  
  // Investment recommendations
  const investmentRecommendations = getInvestmentRecommendations(assetAllocation, plan.riskTolerance);
  
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

function getInvestmentRecommendations(allocation: { equity: number; debt: number; gold: number }, riskTolerance: string) {
  const recommendations = [];
  
  // Equity recommendations
  if (allocation.equity > 0) {
    recommendations.push({
      category: "Equity Mutual Funds",
      instruments: [
        {
          name: "Parag Parikh Flexi Cap Fund",
          type: "Flexi Cap",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "12-15%",
          risk: riskTolerance === 'conservative' ? 'Medium' : 'High',
        },
        {
          name: "Axis Midcap Fund",
          type: "Mid Cap",
          allocation: Math.round(allocation.equity * 0.30),
          returns: "13-16%",
          risk: 'High',
        },
        {
          name: "HDFC Index Fund - Nifty 50",
          type: "Index Fund",
          allocation: Math.round(allocation.equity * 0.35),
          returns: "11-13%",
          risk: 'Medium',
        },
      ],
    });
  }
  
  // Debt recommendations
  if (allocation.debt > 0) {
    recommendations.push({
      category: "Debt & Fixed Income",
      instruments: [
        {
          name: "ICICI Prudential Corporate Bond Fund",
          type: "Corporate Bond",
          allocation: Math.round(allocation.debt * 0.50),
          returns: "7-8%",
          risk: 'Low',
        },
        {
          name: "SBI Fixed Deposit",
          type: "Bank FD",
          allocation: Math.round(allocation.debt * 0.30),
          returns: "6.5-7%",
          risk: 'Very Low',
        },
        {
          name: "Axis Dynamic Bond Fund",
          type: "Debt Fund",
          allocation: Math.round(allocation.debt * 0.20),
          returns: "7-9%",
          risk: 'Low',
        },
      ],
    });
  }
  
  // Gold recommendations
  if (allocation.gold > 0) {
    recommendations.push({
      category: "Gold & Alternative Assets",
      instruments: [
        {
          name: "SBI Gold ETF",
          type: "Gold ETF",
          allocation: Math.round(allocation.gold * 0.60),
          returns: "8-10%",
          risk: 'Medium',
        },
        {
          name: "HDFC Gold Fund",
          type: "Gold Fund",
          allocation: Math.round(allocation.gold * 0.40),
          returns: "8-10%",
          risk: 'Medium',
        },
      ],
    });
  }
  
  return recommendations;
}
