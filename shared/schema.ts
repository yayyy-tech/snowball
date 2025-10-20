import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - updated for Replit Auth (supports Google login)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const retirementPlans = pgTable("retirement_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  
  // Step 1: Personal (OLD - keeping for backward compatibility)
  fullName: text("full_name").notNull(),
  currentAge: integer("current_age").notNull(),
  retirementAge: integer("retirement_age").notNull(),
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  dependents: integer("dependents"),
  spouseName: text("spouse_name"),
  spouseAge: integer("spouse_age"),
  spouseWorking: boolean("spouse_working"),
  spouseIncome: integer("spouse_income"),
  
  // Step 2: Income (OLD)
  monthlyIncome: integer("monthly_income").notNull(),
  employmentType: text("employment_type"),
  hasHomeLoan: boolean("has_home_loan"),
  homeLoanEmi: integer("home_loan_emi"),
  homeLoanTenure: integer("home_loan_tenure"),
  
  // Step 3: Assets (OLD)
  realEstateValue: integer("real_estate_value"),
  stocksValue: integer("stocks_value"),
  mutualFundsValue: integer("mutual_funds_value"),
  ppfEpfNps: integer("ppf_epf_nps"),
  bankDeposits: integer("bank_deposits"),
  goldAssets: integer("gold_assets"),
  
  // Step 4: Goals (OLD)
  retirementLifestyle: text("retirement_lifestyle"),
  postRetirementMonthlyExpense: integer("post_retirement_monthly_expense"),
  legacyGoal: integer("legacy_goal"),
  majorExpenses: text("major_expenses").array(),
  
  // Step 5: Risk (OLD)
  riskTolerance: text("risk_tolerance"),
  investmentExperience: text("investment_experience"),
  preferredAssetMix: text("preferred_asset_mix"),
  
  // Step 6: Tax (OLD)
  taxRegime: text("tax_regime"),
  section80CInvestment: integer("section_80c_investment"),
  
  // NEW 5-Step Flow Fields
  // Step 2: Money Flow
  savingsRate: integer("savings_rate"), // Percentage 0-100
  essentialExpenseRatio: integer("essential_expense_ratio"), // Default 60
  lifestyleExpenseRatio: integer("lifestyle_expense_ratio"), // Default 40
  
  // Step 3: Assets & Obligations (simplified)
  totalAssets: integer("total_assets"), // Combined assets value
  loanEmi: integer("loan_emi"), // Combined EMI
  loanYearsLeft: integer("loan_years_left"),
  
  // Step 4: Dream Retirement
  lifestyleChoice: text("lifestyle_choice"), // modest, comfortable, luxury, nomadic
  retirementLocation: text("retirement_location"), // City name for COLI adjustment
  longevityYears: integer("longevity_years"), // How long money should last
  
  // Step 5: Risk & Route
  portfolioDropReaction: text("portfolio_drop_reaction"), // sleep_fine, worried, panic
  incomeVsGrowthPreference: integer("income_vs_growth_preference"), // 0-100 slider
  riskScore: integer("risk_score"), // 1-5 calculated score
  
  // AI Calculated Fields
  freedomScore: integer("freedom_score"), // 0-100
  inferredMonthlyExpense: integer("inferred_monthly_expense"), // AI calculated if not provided
  replacementRatio: integer("replacement_ratio"), // 70, 90, 120, or 110 based on lifestyle
  
  // Calculated results (stored as JSON for flexibility)
  calculatedPlan: jsonb("calculated_plan"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertRetirementPlanSchema = createInsertSchema(retirementPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRetirementPlan = z.infer<typeof insertRetirementPlanSchema>;
export type RetirementPlan = typeof retirementPlans.$inferSelect;

export interface GPTRecommendation {
  overview: string;
  keyInsights: string[];
  recommendations: {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }[];
  riskAnalysis: string;
  nextSteps: string[];
}

export interface CalculatedPlan {
  yearsToRetirement: number;
  yearsInRetirement: number;
  monthlyExpenseAtRetirement: number;
  baseCorpusNeeded: number;
  bufferAmount: number;
  totalCorpusNeeded: number;
  totalAssets: number;
  projectedAssetValue: number;
  monthlySavings: number;
  sipAmount: number;
  projectedSipValue: number;
  accumulationYears: { year: number; sipAmount: number; yearEndValue: number }[];
  annualTax: number;
  monthlySavingsAfterTax: number;
  swpMonthlyWithdrawal: number;
  withdrawalYears: { year: number; withdrawal: number; balance: number }[];
  loanEndYear?: number;
  additionalSavingsAfterLoan?: number;
  assetAllocation: { equity: number; debt: number; gold: number };
  investmentRecommendations: {
    category: string;
    instruments: {
      name: string;
      type: string;
      allocation: number;
      returns: string;
      risk: string;
      reason?: string;
    }[];
  }[];
  freedomScore: number;
  riskScore: number;
  adviceTriggers: string[];
}
