import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const retirementPlans = pgTable("retirement_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  
  // Step 1: Personal
  fullName: text("full_name").notNull(),
  currentAge: integer("current_age").notNull(),
  retirementAge: integer("retirement_age").notNull(),
  gender: text("gender").notNull(),
  maritalStatus: text("marital_status").notNull(),
  dependents: integer("dependents").notNull(),
  spouseName: text("spouse_name"),
  spouseAge: integer("spouse_age"),
  spouseWorking: boolean("spouse_working"),
  spouseIncome: integer("spouse_income"),
  
  // Step 2: Income
  monthlyIncome: integer("monthly_income").notNull(),
  employmentType: text("employment_type").notNull(),
  hasHomeLoan: boolean("has_home_loan"),
  homeLoanEmi: integer("home_loan_emi"),
  homeLoanTenure: integer("home_loan_tenure"),
  
  // Step 3: Assets
  realEstateValue: integer("real_estate_value"),
  stocksValue: integer("stocks_value"),
  mutualFundsValue: integer("mutual_funds_value"),
  ppfEpfNps: integer("ppf_epf_nps"),
  bankDeposits: integer("bank_deposits"),
  goldAssets: integer("gold_assets"),
  
  // Step 4: Insurance
  healthInsurance: integer("health_insurance"),
  lifeInsurance: integer("life_insurance"),
  
  // Step 5: Goals
  retirementLifestyle: text("retirement_lifestyle").notNull(),
  postRetirementMonthlyExpense: integer("post_retirement_monthly_expense").notNull(),
  legacyGoal: integer("legacy_goal"),
  majorExpenses: text("major_expenses").array(),
  
  // Step 6: Risk
  riskTolerance: text("risk_tolerance").notNull(),
  investmentExperience: text("investment_experience").notNull(),
  preferredAssetMix: text("preferred_asset_mix").notNull(),
  
  // Step 7: Tax
  taxRegime: text("tax_regime").notNull(),
  section80CInvestment: integer("section_80c_investment"),
  
  // Step 8: Emergency
  emergencyFundMonths: integer("emergency_fund_months").notNull(),
  hasEmergencyFund: boolean("has_emergency_fund").notNull(),
  currentEmergencyFund: integer("current_emergency_fund"),
  
  // Step 9: Health
  chronicConditions: text("chronic_conditions").array(),
  healthcareExpectation: text("healthcare_expectation").notNull(),
  
  // Calculated results (stored as JSON for flexibility)
  calculatedPlan: jsonb("calculated_plan"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRetirementPlanSchema = createInsertSchema(retirementPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRetirementPlan = z.infer<typeof insertRetirementPlanSchema>;
export type RetirementPlan = typeof retirementPlans.$inferSelect;
