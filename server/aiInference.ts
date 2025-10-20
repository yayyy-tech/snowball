/**
 * AI Inference Engine for Snowball
 * Calculates Freedom Score, infers expenses, maps lifestyle choices
 * Inspired by Buffett, Damani, Munger, and Housel wisdom
 */

const INFLATION_RATE = 0.06;
const LIFE_EXPECTANCY = 85;

// Indian household expense patterns (as % of income)
const INCOME_TO_EXPENSE_RATIOS = {
  low: 0.85,      // Income < 50K/month
  medium: 0.75,   // Income 50K-150K/month
  high: 0.65,     // Income > 150K/month
};

// Lifestyle to income replacement ratio mapping
const LIFESTYLE_REPLACEMENT_RATIOS = {
  modest: 70,        // 70% of current income
  comfortable: 90,   // 90% of current income
  luxury: 120,       // 120% of current income
  nomadic: 110,      // 110% of current income (travel costs)
};

// City Cost of Living Index (relative to national average = 100)
const CITY_COLI_INDEX: Record<string, number> = {
  mumbai: 130,
  delhi: 120,
  bangalore: 115,
  pune: 110,
  hyderabad: 105,
  chennai: 105,
  kolkata: 100,
  ahmedabad: 95,
  jaipur: 90,
  lucknow: 85,
  other: 100,
};

/**
 * Infer monthly expenses from income and dependents
 * Based on Indian household spending patterns
 */
export function inferMonthlyExpense(
  monthlyIncome: number,
  dependents: number = 0
): number {
  let baseRatio: number;
  
  if (monthlyIncome < 50000) {
    baseRatio = INCOME_TO_EXPENSE_RATIOS.low;
  } else if (monthlyIncome <= 150000) {
    baseRatio = INCOME_TO_EXPENSE_RATIOS.medium;
  } else {
    baseRatio = INCOME_TO_EXPENSE_RATIOS.high;
  }
  
  // Adjust for dependents (each dependent adds ~8% to expenses)
  const dependentAdjustment = dependents * 0.08;
  const adjustedRatio = Math.min(0.95, baseRatio + dependentAdjustment);
  
  return Math.round(monthlyIncome * adjustedRatio);
}

/**
 * Map lifestyle choice to income replacement ratio
 */
export function getReplacementRatio(lifestyleChoice: string): number {
  const lifestyle = lifestyleChoice.toLowerCase() as keyof typeof LIFESTYLE_REPLACEMENT_RATIOS;
  return LIFESTYLE_REPLACEMENT_RATIOS[lifestyle] || 90;
}

/**
 * Get Cost of Living adjustment for city
 */
export function getCityColiAdjustment(city: string): number {
  const cityKey = city.toLowerCase() as keyof typeof CITY_COLI_INDEX;
  return (CITY_COLI_INDEX[cityKey] || CITY_COLI_INDEX.other) / 100;
}

/**
 * Calculate risk score from behavioral questions
 * Portfolio drop reaction: sleep_fine (5), worried (3), panic (1)
 * Income vs Growth: 0 (income) to 100 (growth)
 */
export function calculateRiskScore(
  portfolioDropReaction: string,
  incomeVsGrowthPreference: number
): number {
  // Base score from portfolio drop reaction
  let score = 3; // Default moderate
  
  switch (portfolioDropReaction.toLowerCase()) {
    case 'sleep_fine':
    case 'sleep fine':
      score = 5;
      break;
    case 'worried':
      score = 3;
      break;
    case 'panic':
      score = 1;
      break;
  }
  
  // Adjust based on income vs growth preference
  // Preference > 60 indicates growth-oriented (increase score)
  // Preference < 40 indicates income-oriented (decrease score)
  if (incomeVsGrowthPreference > 60) {
    score = Math.min(5, score + 1);
  } else if (incomeVsGrowthPreference < 40) {
    score = Math.max(1, score - 1);
  }
  
  return score;
}

/**
 * Calculate recommended savings rate based on current age and goals
 * Younger = can start with lower %, Older = need higher %
 */
export function getRecommendedSavingsRate(
  currentAge: number,
  retirementAge: number,
  dependents: number = 0
): number {
  const yearsToRetire = retirementAge - currentAge;
  let baseSavingsRate = 20; // Default 20%
  
  // Adjust by time horizon
  if (yearsToRetire > 30) {
    baseSavingsRate = 15;
  } else if (yearsToRetire < 20) {
    baseSavingsRate = 30;
  } else if (yearsToRetire < 10) {
    baseSavingsRate = 40;
  }
  
  // Adjust for dependents (each reduces capacity by 3%)
  baseSavingsRate = Math.max(10, baseSavingsRate - (dependents * 3));
  
  return baseSavingsRate;
}

/**
 * Calculate Freedom Score (0-100)
 * Measures how on-track user is for retirement independence
 * 
 * Formula: (Current Corpus + FV of Savings) / Target Corpus × 100
 */
export function calculateFreedomScore(params: {
  currentAge: number;
  retirementAge: number;
  monthlyIncome: number;
  savingsRate: number; // as percentage
  totalAssets: number;
  postRetirementMonthlyExpense: number;
  longevityYears?: number;
  riskScore: number;
}): number {
  const {
    currentAge,
    retirementAge,
    monthlyIncome,
    savingsRate,
    totalAssets,
    postRetirementMonthlyExpense,
    longevityYears,
    riskScore,
  } = params;
  
  const yearsToRetirement = retirementAge - currentAge;
  const retirementDuration = longevityYears || (LIFE_EXPECTANCY - retirementAge);
  
  // Calculate monthly savings
  const monthlySavings = monthlyIncome * (savingsRate / 100);
  
  // Estimate returns based on risk score
  // Risk 1-2: Conservative (7%), 3: Moderate (9%), 4-5: Aggressive (11%)
  let annualReturns = 0.09;
  if (riskScore <= 2) {
    annualReturns = 0.07;
  } else if (riskScore >= 4) {
    annualReturns = 0.11;
  }
  
  const monthlyRate = annualReturns / 12;
  
  // Calculate FV of current assets
  const fvAssets = totalAssets * Math.pow(1 + annualReturns, yearsToRetirement);
  
  // Calculate FV of monthly savings (simple calculation without step-up for Freedom Score)
  const months = yearsToRetirement * 12;
  const fvSavings = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  // Total accumulated corpus
  const totalAccumulated = fvAssets + fvSavings;
  
  // Calculate target corpus needed
  // PV of annuity: PMT × ((1 - (1+r)^-n) / r)
  const monthlyExpenseAtRetirement = postRetirementMonthlyExpense * Math.pow(1 + INFLATION_RATE, yearsToRetirement);
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
  
  const realReturn = annualReturns - INFLATION_RATE;
  const targetCorpus = annualExpenseAtRetirement * ((1 - Math.pow(1 + realReturn, -retirementDuration)) / realReturn);
  
  // Calculate Freedom Score
  const freedomScore = Math.min(100, Math.round((totalAccumulated / targetCorpus) * 100));
  
  return freedomScore;
}

/**
 * Get asset allocation based on risk score
 * Returns {equity%, debt%, gold%}
 */
export function getAssetAllocationByRiskScore(riskScore: number): {
  equity: number;
  debt: number;
  gold: number;
} {
  const gold = 10; // Always 10% in gold
  
  let equity = 50; // Default moderate
  
  switch (riskScore) {
    case 1:
      equity = 20;
      break;
    case 2:
      equity = 30;
      break;
    case 3:
      equity = 50;
      break;
    case 4:
      equity = 60;
      break;
    case 5:
      equity = 70;
      break;
  }
  
  const debt = 100 - equity - gold;
  
  return { equity, debt, gold };
}

/**
 * Determine if user needs advice bot nudge
 * Returns array of triggered advice
 */
export function getAdviceBotTriggers(params: {
  freedomScore: number;
  savingsRate: number;
  loanEmi: number;
  monthlyIncome: number;
  retirementAge: number;
  currentAge: number;
  riskScore: number;
  lifestyleChoice: string;
}): string[] {
  const triggers: string[] = [];
  const {
    freedomScore,
    savingsRate,
    loanEmi,
    monthlyIncome,
    retirementAge,
    currentAge,
    riskScore,
    lifestyleChoice,
  } = params;
  
  // Low Freedom Score
  if (freedomScore < 70) {
    triggers.push('low_freedom_score');
  }
  
  // Low savings rate
  if (savingsRate < 10) {
    triggers.push('low_savings');
  }
  
  // High EMI burden
  const emiToIncomeRatio = loanEmi / monthlyIncome;
  if (emiToIncomeRatio > 0.4) {
    triggers.push('high_debt');
  }
  
  // Early retirement goal
  if (retirementAge - currentAge < 15) {
    triggers.push('early_retirement');
  }
  
  // Risk mismatch (conservative investor with luxury goals)
  if (riskScore < 3 && (lifestyleChoice === 'luxury' || lifestyleChoice === 'nomadic')) {
    triggers.push('risk_goal_mismatch');
  }
  
  // Panic investor
  if (riskScore === 1) {
    triggers.push('panic_investor');
  }
  
  return triggers;
}
