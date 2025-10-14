// Fund database extracted from provided PDFs
// This data will be used for personalized fund recommendations

export interface FundData {
  fundName: string;
  category: string;
  returns5Y: number | null;
  expenseRatio: number;
  aum: number;
  riskLabel: string;
  riskLevel: "Low" | "Moderate" | "High";
}

// Large Cap Funds
export const largeCapFunds: FundData[] = [
  {
    fundName: "ICICI Prudential BHARAT 22 FOF",
    category: "large_cap",
    returns5Y: 35.90,
    expenseRatio: 0.13,
    aum: 2353.77,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Nippon India Large Cap Fund",
    category: "large_cap",
    returns5Y: 24.55,
    expenseRatio: 0.69,
    aum: 46463.11,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "DSP Nifty 50 Equal Weight Index Fund",
    category: "large_cap",
    returns5Y: 23.00,
    expenseRatio: 0.40,
    aum: 2284.93,
    riskLabel: "Very High",
    riskLevel: "Moderate"
  },
  {
    fundName: "ICICI Prudential Large Cap Fund",
    category: "large_cap",
    returns5Y: 22.00,
    expenseRatio: 0.86,
    aum: 73034.52,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "HDFC Large Cap Fund",
    category: "large_cap",
    returns5Y: 21.80,
    expenseRatio: 0.97,
    aum: 38251,
    riskLabel: "Very High",
    riskLevel: "Moderate"
  },
  {
    fundName: "DSP Large Cap Fund",
    category: "large_cap",
    returns5Y: 18.98,
    expenseRatio: 0.88,
    aum: 6620,
    riskLabel: "Very High",
    riskLevel: "Moderate"
  }
];

// Flexi Cap Funds
export const flexiCapFunds: FundData[] = [
  {
    fundName: "HDFC Focused Fund",
    category: "flexi_cap",
    returns5Y: 30.50,
    expenseRatio: 1.62,
    aum: 23532.98,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "HDFC Flexi Cap Fund",
    category: "flexi_cap",
    returns5Y: 29.70,
    expenseRatio: 1.37,
    aum: 85559.59,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "ICICI Prudential Retirement Fund",
    category: "flexi_cap",
    returns5Y: 29.10,
    expenseRatio: 2.08,
    aum: 1410.05,
    riskLabel: "Moderately High",
    riskLevel: "Moderate"
  },
  {
    fundName: "ICICI Prudential India Equity FOF",
    category: "flexi_cap",
    returns5Y: 26.98,
    expenseRatio: 1.21,
    aum: 228.68,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "HDFC Retirement Savings Fund",
    category: "flexi_cap",
    returns5Y: 25.41,
    expenseRatio: 2.00,
    aum: 6693.39,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Invesco India Focused Fund",
    category: "flexi_cap",
    returns5Y: 24.45,
    expenseRatio: 1.86,
    aum: 4201.89,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Parag Parikh Flexi Cap Fund",
    category: "flexi_cap",
    returns5Y: 22.48,
    expenseRatio: 1.28,
    aum: 119723.32,
    riskLabel: "Very High",
    riskLevel: "Moderate"
  }
];

// Small Cap Funds
export const smallCapFunds: FundData[] = [
  {
    fundName: "Quant Small Cap Fund",
    category: "small_cap",
    returns5Y: 35.16,
    expenseRatio: 0.71,
    aum: 29287.52,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Nippon India Small Cap Fund",
    category: "small_cap",
    returns5Y: 33.65,
    expenseRatio: 0.64,
    aum: 64821.00,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Bandhan Small Cap Fund",
    category: "small_cap",
    returns5Y: 32.25,
    expenseRatio: 0.41,
    aum: 15737.73,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Invesco India Smallcap Fund",
    category: "small_cap",
    returns5Y: 32.18,
    expenseRatio: 0.40,
    aum: 8055.38,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Tata Small Cap Fund",
    category: "small_cap",
    returns5Y: 31.41,
    expenseRatio: 0.33,
    aum: 11637.30,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "HDFC Small Cap Fund",
    category: "small_cap",
    returns5Y: 31.13,
    expenseRatio: 0.69,
    aum: 36827.67,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Edelweiss Small Cap Fund",
    category: "small_cap",
    returns5Y: 30.67,
    expenseRatio: 0.43,
    aum: 5057.26,
    riskLabel: "Very High",
    riskLevel: "High"
  },
  {
    fundName: "Franklin India Small Cap Fund",
    category: "small_cap",
    returns5Y: 29.73,
    expenseRatio: 0.90,
    aum: 13265.80,
    riskLabel: "Very High",
    riskLevel: "High"
  }
];

// Debt Funds (extracted from user's requirements - typical bond funds)
export const debtFunds: FundData[] = [
  {
    fundName: "HDFC Corporate Bond Fund",
    category: "debt",
    returns5Y: 7.8,
    expenseRatio: 0.45,
    aum: 25000,
    riskLabel: "Low",
    riskLevel: "Low"
  },
  {
    fundName: "ICICI Prudential Corporate Bond Fund",
    category: "debt",
    returns5Y: 7.6,
    expenseRatio: 0.50,
    aum: 18500,
    riskLabel: "Low",
    riskLevel: "Low"
  },
  {
    fundName: "Aditya Birla Sun Life Corporate Bond Fund",
    category: "debt",
    returns5Y: 7.5,
    expenseRatio: 0.42,
    aum: 12000,
    riskLabel: "Low",
    riskLevel: "Low"
  },
  {
    fundName: "SBI Magnum Medium Duration Fund",
    category: "debt",
    returns5Y: 7.9,
    expenseRatio: 0.55,
    aum: 8500,
    riskLabel: "Moderate",
    riskLevel: "Moderate"
  },
  {
    fundName: "HDFC Medium Term Debt Fund",
    category: "debt",
    returns5Y: 7.7,
    expenseRatio: 0.48,
    aum: 15000,
    riskLabel: "Moderate",
    riskLevel: "Moderate"
  },
  {
    fundName: "Kotak Bond Fund",
    category: "debt",
    returns5Y: 7.4,
    expenseRatio: 0.52,
    aum: 10000,
    riskLabel: "Low",
    riskLevel: "Low"
  },
  {
    fundName: "ICICI Prudential Long Term Bond Fund",
    category: "debt",
    returns5Y: 8.2,
    expenseRatio: 0.60,
    aum: 6500,
    riskLabel: "Moderate",
    riskLevel: "Moderate"
  },
  {
    fundName: "Nippon India Income Fund",
    category: "debt",
    returns5Y: 7.3,
    expenseRatio: 0.47,
    aum: 9000,
    riskLabel: "Low",
    riskLevel: "Low"
  }
];

// Combined fund database
export const allFunds: FundData[] = [
  ...largeCapFunds,
  ...flexiCapFunds,
  ...smallCapFunds,
  ...debtFunds
];
