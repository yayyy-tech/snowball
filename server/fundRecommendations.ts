import { allFunds, debtFunds, largeCapFunds, flexiCapFunds, smallCapFunds, type FundData } from "./fundData";

export type RiskAppetite = "conservative" | "moderate" | "aggressive";
export type GrowthPreference = "stable" | "balanced" | "high_growth";
export type FundType = "equity" | "debt";

export interface RecommendationInput {
  riskAppetite: RiskAppetite;
  totalAmount: number;
  growthPreference: GrowthPreference;
  fundType: FundType;
  age?: number;
  retirementAge?: number;
  desiredLifestyle?: string;
  monthlyExpenses?: number;
}

export interface FundRecommendation {
  fundName: string;
  category: string;
  risk: string;
  returns5Y: string;
  expenseRatio: string;
  aum: string;
  allocation: string;
  allocationAmount: number;
  reasoning: string;
}

export interface RecommendationOutput {
  recommendedFunds: FundRecommendation[];
  totalAllocated: string;
  allocationSummary: {
    lowRisk: string;
    moderateRisk: string;
    highRisk: string;
  };
}

// Format number to Indian currency
function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Get allocation percentages based on risk appetite
function getAllocationStrategy(riskAppetite: RiskAppetite): { low: number; moderate: number; high: number } {
  switch (riskAppetite) {
    case "conservative":
      return { low: 0.50, moderate: 0.30, high: 0.20 };
    case "moderate":
      return { low: 0.30, moderate: 0.50, high: 0.20 };
    case "aggressive":
      return { low: 0.10, moderate: 0.40, high: 0.50 };
  }
}

// Filter funds based on growth preference
function filterByGrowthPreference(
  funds: FundData[],
  growthPreference: GrowthPreference,
  riskLevel: "Low" | "Moderate" | "High"
): FundData[] {
  const filtered = funds.filter(f => f.riskLevel === riskLevel);
  
  // Sort by 5Y returns (descending)
  const sorted = filtered.sort((a, b) => {
    const aReturn = a.returns5Y || 0;
    const bReturn = b.returns5Y || 0;
    return bReturn - aReturn;
  });

  switch (growthPreference) {
    case "stable":
      // Prefer lower expense ratio and stable funds
      return sorted.sort((a, b) => a.expenseRatio - b.expenseRatio).slice(0, 3);
    case "balanced":
      // Mix of good returns and reasonable expense
      return sorted.slice(0, 3);
    case "high_growth":
      // Top performers by returns
      return sorted.slice(0, 3);
  }
}

// Select funds based on risk appetite and growth preference
function selectFunds(
  input: RecommendationInput,
  availableFunds: FundData[]
): { funds: FundData[]; allocations: number[] } {
  const strategy = getAllocationStrategy(input.riskAppetite);
  const selectedFunds: FundData[] = [];
  const allocations: number[] = [];

  // Select Low Risk funds
  const lowRiskFunds = filterByGrowthPreference(availableFunds, input.growthPreference, "Low");
  if (lowRiskFunds.length > 0 && strategy.low > 0) {
    const fund = lowRiskFunds[0];
    selectedFunds.push(fund);
    allocations.push(input.totalAmount * strategy.low);
  }

  // Select Moderate Risk funds
  const moderateRiskFunds = filterByGrowthPreference(availableFunds, input.growthPreference, "Moderate");
  if (moderateRiskFunds.length > 0 && strategy.moderate > 0) {
    const fundsToAdd = moderateRiskFunds.slice(0, 2);
    const amountPerFund = (input.totalAmount * strategy.moderate) / fundsToAdd.length;
    fundsToAdd.forEach(fund => {
      selectedFunds.push(fund);
      allocations.push(amountPerFund);
    });
  } else if (strategy.moderate > 0) {
    // Fallback to low risk if no moderate available
    if (lowRiskFunds.length > 1) {
      const fund = lowRiskFunds[1];
      selectedFunds.push(fund);
      allocations.push(input.totalAmount * strategy.moderate);
    }
  }

  // Select High Risk funds
  const highRiskFunds = filterByGrowthPreference(availableFunds, input.growthPreference, "High");
  if (highRiskFunds.length > 0 && strategy.high > 0) {
    const fundsToAdd = highRiskFunds.slice(0, 2);
    const amountPerFund = (input.totalAmount * strategy.high) / fundsToAdd.length;
    fundsToAdd.forEach(fund => {
      selectedFunds.push(fund);
      allocations.push(amountPerFund);
    });
  } else if (strategy.high > 0) {
    // Fallback to moderate risk if no high available
    if (moderateRiskFunds.length > 2) {
      const fund = moderateRiskFunds[2];
      selectedFunds.push(fund);
      allocations.push(input.totalAmount * strategy.high);
    } else if (lowRiskFunds.length > 2) {
      const fund = lowRiskFunds[2];
      selectedFunds.push(fund);
      allocations.push(input.totalAmount * strategy.high);
    }
  }

  return { funds: selectedFunds, allocations };
}

// Generate reasoning for fund selection
function generateReasoning(
  fund: FundData,
  input: RecommendationInput
): string {
  const reasons: string[] = [];
  const timeHorizon = input.retirementAge && input.age ? input.retirementAge - input.age : 0;

  if (input.fundType === "debt") {
    reasons.push("Corporate bond fund for stable returns");
    if (fund.returns5Y && fund.returns5Y > 7.5) {
      reasons.push(`Strong ${fund.returns5Y}% 5Y returns`);
    }
    if (fund.expenseRatio < 0.5) {
      reasons.push("Low expense ratio");
    }
  } else {
    // Equity funds
    if (fund.category === "large_cap") {
      reasons.push("Established large-cap companies");
    } else if (fund.category === "flexi_cap") {
      reasons.push("Flexible allocation across market caps");
    } else if (fund.category === "small_cap") {
      reasons.push("High growth potential in small caps");
    }

    if (fund.returns5Y && fund.returns5Y > 25) {
      reasons.push(`Excellent ${fund.returns5Y}% 5Y returns`);
    } else if (fund.returns5Y && fund.returns5Y > 20) {
      reasons.push(`Strong ${fund.returns5Y}% 5Y returns`);
    }

    if (fund.aum > 50000) {
      reasons.push("Large AUM indicates investor confidence");
    }
  }

  // Add personalized reasoning based on user profile
  if (input.age && input.age < 35) {
    reasons.push("Suitable for young investors with long investment horizon");
  } else if (input.age && input.age >= 50) {
    reasons.push("Appropriate for near-retirement balanced approach");
  }

  if (timeHorizon > 20) {
    reasons.push("Well-suited for your 20+ year investment timeline");
  } else if (timeHorizon > 10) {
    reasons.push("Matches your medium-term retirement goals");
  } else if (timeHorizon > 0) {
    reasons.push("Aligned with your shorter time horizon");
  }

  if (input.desiredLifestyle === "luxury" || input.desiredLifestyle === "comfortable") {
    reasons.push(`Supports your ${input.desiredLifestyle} retirement lifestyle goals`);
  }

  if (input.riskAppetite === "conservative") {
    reasons.push("Suitable for your conservative risk profile");
  } else if (input.riskAppetite === "aggressive") {
    reasons.push("Aligned with your aggressive growth goals");
  }

  return reasons.join(". ") + ".";
}

// Main recommendation function
export function generateFundRecommendations(input: RecommendationInput): RecommendationOutput {
  // Use minimum viable amount for recommendations if actual amount is too small
  // This ensures users always get fund recommendations even with small SIPs
  const MIN_RECOMMENDATION_AMOUNT = 50000; // ₹50K total investment over period
  const effectiveAmount = Math.max(input.totalAmount, MIN_RECOMMENDATION_AMOUNT);
  
  // Log if we're using minimum amount
  if (input.totalAmount < MIN_RECOMMENDATION_AMOUNT && input.totalAmount > 0) {
    console.log(`[FUND RECS] Using minimum amount ₹${MIN_RECOMMENDATION_AMOUNT.toLocaleString('en-IN')} for recommendations (actual: ₹${input.totalAmount.toLocaleString('en-IN')})`);
  }
  
  // Only return empty if amount is exactly 0 (user chose not to invest)
  if (input.totalAmount === 0) {
    return {
      recommendedFunds: [],
      totalAllocated: "₹0",
      allocationSummary: {
        lowRisk: "₹0",
        moderateRisk: "₹0",
        highRisk: "₹0"
      }
    };
  }

  // Select appropriate fund universe
  const availableFunds = input.fundType === "debt" ? debtFunds : 
    [...largeCapFunds, ...flexiCapFunds, ...smallCapFunds];

  // Select funds and calculate allocations using effective amount
  const effectiveInput = { ...input, totalAmount: effectiveAmount };
  const { funds, allocations } = selectFunds(effectiveInput, availableFunds);

  if (funds.length === 0) {
    throw new Error("No suitable funds found for the given criteria");
  }

  // Build recommendations
  const recommendations: FundRecommendation[] = funds.map((fund, index) => ({
    fundName: fund.fundName,
    category: fund.category.replace('_', ' ').toUpperCase(),
    risk: fund.riskLevel,
    returns5Y: fund.returns5Y ? `${fund.returns5Y}%` : "N/A",
    expenseRatio: `${fund.expenseRatio}%`,
    aum: formatIndianCurrency(fund.aum * 10000),
    allocation: formatIndianCurrency(allocations[index]),
    allocationAmount: allocations[index],
    reasoning: generateReasoning(fund, input)
  }));

  // Calculate allocation summary
  const strategy = getAllocationStrategy(input.riskAppetite);
  const totalAllocated = allocations.reduce((sum, amt) => sum + amt, 0);

  return {
    recommendedFunds: recommendations,
    totalAllocated: formatIndianCurrency(totalAllocated),
    allocationSummary: {
      lowRisk: formatIndianCurrency(effectiveAmount * strategy.low),
      moderateRisk: formatIndianCurrency(effectiveAmount * strategy.moderate),
      highRisk: formatIndianCurrency(effectiveAmount * strategy.high)
    }
  };
}

// Convenience function for getting both equity and debt recommendations
export function generateCompleteRecommendations(
  riskAppetite: RiskAppetite,
  equityAmount: number,
  debtAmount: number,
  growthPreference: GrowthPreference,
  age?: number,
  retirementAge?: number,
  desiredLifestyle?: string,
  monthlyExpenses?: number
): { equity: RecommendationOutput; debt: RecommendationOutput } {
  const equityRec = generateFundRecommendations({
    riskAppetite,
    totalAmount: equityAmount,
    growthPreference,
    fundType: "equity",
    age,
    retirementAge,
    desiredLifestyle,
    monthlyExpenses
  });

  const debtRec = generateFundRecommendations({
    riskAppetite,
    totalAmount: debtAmount,
    growthPreference,
    fundType: "debt",
    age,
    retirementAge,
    desiredLifestyle,
    monthlyExpenses
  });

  return { equity: equityRec, debt: debtRec };
}
