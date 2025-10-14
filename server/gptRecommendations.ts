import { openai } from "./openai";
import type { RetirementPlan, GPTRecommendation, CalculatedPlan } from "@shared/schema";

export async function generateGPTRecommendations(
  plan: RetirementPlan
): Promise<GPTRecommendation> {
  const currentAge = plan.currentAge;
  const yearsToRetirement = plan.retirementAge - currentAge;
  const calculatedPlan = plan.calculatedPlan as CalculatedPlan | null;

  const prompt = `You are an expert retirement planning advisor for Indian investors. Analyze this user's retirement plan and provide personalized investment recommendations.

USER PROFILE:
- Age: ${currentAge} years old
- Retirement Age: ${plan.retirementAge}
- Years to Retirement: ${yearsToRetirement}
- Marital Status: ${plan.maritalStatus}
${plan.maritalStatus === "married" ? `- Spouse Age: ${plan.spouseAge}, Spouse Working: ${plan.spouseWorking ? "Yes" : "No"}` : ""}
- Desired Lifestyle: ${plan.retirementLifestyle}
- Post-Retirement Monthly Expenses: ₹${plan.postRetirementMonthlyExpense?.toLocaleString("en-IN") || "N/A"}

FINANCIAL SITUATION:
- Monthly Income: ₹${plan.monthlyIncome.toLocaleString("en-IN")}
${plan.maritalStatus === "married" && plan.spouseWorking ? `- Spouse Monthly Income: ₹${plan.spouseIncome?.toLocaleString("en-IN") || 0}` : ""}
- Total Assets: ₹${((plan.realEstateValue || 0) + (plan.stocksValue || 0) + (plan.mutualFundsValue || 0) + (plan.ppfEpfNps || 0) + (plan.bankDeposits || 0) + (plan.goldAssets || 0)).toLocaleString("en-IN")}
  - Real Estate: ₹${plan.realEstateValue?.toLocaleString("en-IN") || 0}
  - Stocks: ₹${plan.stocksValue?.toLocaleString("en-IN") || 0}
  - Mutual Funds: ₹${plan.mutualFundsValue?.toLocaleString("en-IN") || 0}
  - PPF/EPF/NPS: ₹${plan.ppfEpfNps?.toLocaleString("en-IN") || 0}
  - Bank Deposits: ₹${plan.bankDeposits?.toLocaleString("en-IN") || 0}
  - Gold: ₹${plan.goldAssets?.toLocaleString("en-IN") || 0}
- Risk Tolerance: ${plan.riskTolerance}
- Tax Regime: ${plan.taxRegime}

CALCULATED RETIREMENT PLAN:
- Required Retirement Corpus: ₹${calculatedPlan?.totalCorpusNeeded?.toLocaleString("en-IN") || "N/A"}
- Recommended Monthly SIP: ₹${calculatedPlan?.sipAmount?.toLocaleString("en-IN") || "N/A"}
- Asset Allocation: ${calculatedPlan?.assetAllocation ? `${calculatedPlan.assetAllocation.equity}% Equity, ${calculatedPlan.assetAllocation.debt}% Debt, ${calculatedPlan.assetAllocation.gold}% Gold` : "N/A"}

INSTRUCTIONS:
1. Provide a brief overview of the user's retirement readiness (2-3 sentences)
2. Identify 3-5 key insights about their financial situation
3. Generate 4-6 specific, actionable recommendations prioritized by importance
4. Provide risk analysis considering their age, time horizon, and risk tolerance
5. List 3-4 immediate next steps they should take

Focus on:
- Indian market context (mutual funds, tax-saving instruments, PPF, NPS, etc.)
- ${plan.taxRegime === "new" ? "New tax regime benefits (lower rates, no deductions)" : "Old tax regime deductions (80C, 80D, NPS, etc.)"}
- Age-appropriate investment strategies
- Balancing current lifestyle needs with retirement goals
- Realistic expectations for India's investment landscape

Return your analysis as JSON with this structure:
{
  "overview": "Brief retirement readiness overview",
  "keyInsights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed recommendation with specific actions",
      "priority": "high" | "medium" | "low"
    }
  ],
  "riskAnalysis": "Analysis of their risk profile and investment strategy fit",
  "nextSteps": ["step 1", "step 2", ...]
}`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert retirement planning advisor specializing in the Indian market. Provide practical, actionable advice tailored to Indian investors. Always return valid JSON responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from GPT");
    }

    const result = JSON.parse(content) as GPTRecommendation;
    return result;
  } catch (error: any) {
    console.error("Error generating GPT recommendations:", error);
    throw new Error(`Failed to generate AI recommendations: ${error.message}`);
  }
}
