# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 5-step conversational onboarding flow with AI inference to collect financial data and generates personalized retirement roadmaps with Freedom Score (0-100). The platform calculates required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime (FY 2024-25). Features emotionally intelligent UX with Mini-Stories (wisdom quotes) and AI Advice Bot for contextual nudges.

## Recent Changes (October 2025)

### Critical Bug Fixes: SIP Calculation & Investment Recommendations (October 20, 2025 - Latest)
Fixed critical bugs affecting the 5-step onboarding flow that caused SIP to show ₹0 and missing fund recommendations:

1. **Bug Fix: Loan Double-Counting Leading to ₹0 SIP**:
   - **Root Cause**: When users entered their savings rate in the 5-step flow, the system was subtracting loan EMI again, making monthly savings negative (e.g., 25% of ₹130K = ₹32.5K, then ₹32.5K - ₹50K EMI = -₹17.5K)
   - **Why This Was Wrong**: When someone says "I save 25% of my income," that's AFTER paying all expenses including loans. We were double-counting the loan.
   - **Fix**: Implemented dual-path logic in server/calculations.ts:
     - **5-Step Flow (savingsRate exists)**: `monthlySavings = monthlyIncome * (savingsRate / 100)` - DO NOT subtract loan EMI (already accounted for)
     - **Legacy Flow (no savingsRate)**: `monthlySavings = (income - expenses - tax) / 12` - THEN subtract loan EMI
   - **Backward Compatibility**: Legacy plans without savingsRate field continue to work as before
   - **Impact**: SIP now displays correct positive values even for users with loans (e.g., ₹26K for 25% savings on ₹130K income with ₹50K loan)
   - **Logging**: Added explicit logging to distinguish calculation paths and loan handling

2. **Bug Fix: Only Gold Recommendations Showing**:
   - **Root Cause**: server/fundRecommendations.ts returned empty arrays when `totalAmount <= 0`, causing equity and debt categories to disappear
   - **Fix**: Implemented minimum viable amount (₹50K) for generating recommendations even when actual investment amounts are small
   - **Logic**: Only returns empty if totalAmount is exactly 0 (user chose not to invest)
   - **Impact**: All three categories (Equity, Debt, Gold) now show personalized fund recommendations regardless of SIP amount
   - **Logging**: Added logging when using minimum amount for recommendations

3. **Test Results** (End-to-End Verification with Loan):
   - Test Profile: Age 30, Income ₹130K, Savings 25%, Loan EMI ₹50K, Assets ₹5L, Moderate Risk
   - ✅ Monthly SIP displays ₹26K (positive, not ₹0!)
   - ✅ Savings correctly calculated: 25% × ₹130K = ₹32.5K (loan NOT subtracted)
   - ✅ Equity Mutual Funds: 5 recommendations with allocation details
   - ✅ Debt Funds: Multiple recommendations with expected returns
   - ✅ Gold ETFs: Recommendations present
   - ✅ Freedom Score: 36/100 (calculated correctly)
   - ✅ All dashboard cards rendering without errors

### 5-Step Conversational Onboarding with AI Inference & Freedom Score (October 20, 2025)
Complete redesign of the onboarding experience and dashboard with AI-powered insights:

1. **New 5-Step Conversational Flow** (reduced from 7 steps):
   - **Step 1: Life Snapshot** - Name, age, marital status
   - **Step 2: Money Flow** - Income, savings (AI infers monthly expenses and savings rate automatically)
   - **Step 3: Assets & Obligations** - Current investments, outstanding loans
   - **Step 4: Dream Retirement** - Desired retirement age, lifestyle preference (AI maps to retirement expenses: ₹30K simple, ₹50K comfortable, ₹75K luxurious)
   - **Step 5: Risk & Route** - Risk tolerance (conservative/moderate/aggressive), tax regime preference
   - Progress tracking (1/5, 2/5...) for better UX
   - Conversational copy with emotional engagement

2. **AI Inference Engine** (server/aiInference.ts):
   - **inferMonthlyExpenses**: Calculates expenses from income and savings automatically
   - **calculateSavingsRate**: Determines savings efficiency (percentage of income saved)
   - **inferLifestyleExpenses**: Maps lifestyle choice to monthly retirement expenses
   - **calculateFreedomScore**: 0-100 score based on weighted formula:
     - Savings Rate Score (35%): Rewards efficient savers
     - Time Horizon Score (25%): More time = higher score
     - Asset Score (25%): Current assets relative to goals
     - Risk Score (15%): Appropriate risk-taking
   - **generateAdviceTriggers**: Creates contextual advice based on user's financial situation (e.g., "low_freedom_score", "young_time_advantage", "high_savings_rate")

3. **Freedom Score Display**:
   - Prominent hero section on Dashboard with large animated counter (0-100)
   - Circular progress visualization with color-coded ring
   - Dynamic badges: "Needs attention" (0-40, red), "Good Progress" (41-70, yellow), "Excellent" (71-100, green)
   - Tagline: "A measure of your progress towards financial independence"

4. **Experiential Components**:
   - **MiniStory**: Displays wisdom quotes/financial insights during plan generation
   - **AdviceBot**: Shows personalized advice cards with contextual nudges based on triggers
   - Both use lucide-react icons (no emoji) for professional aesthetic

5. **Dashboard Enhancements**:
   - AnimatedCounter component with framer-motion for smooth number animations
   - Summary cards: Years to Retirement, Retirement Corpus Needed, Monthly SIP Amount
   - Detailed calculation breakdown with accumulation and withdrawal phases
   - Asset allocation chart (equity/debt/gold percentages)
   - Fund recommendations integration

6. **Technical Improvements**:
   - Fixed AnimatedCounter bug where `isInView` check prevented value updates on summary cards
   - Now always sets spring value regardless of viewport visibility while maintaining smooth animations
   - Added comprehensive data validation using Zod schemas
   - Integrated AI inference into calculation pipeline

7. **Schema Updates** (shared/schema.ts):
   - Added fields: `inferredMonthlyExpenses`, `savingsRate`, `lifestylePreference`, `inferredRetirementExpenses`
   - Added calculated fields: `freedomScore`, `riskScore`, `adviceTriggers[]`
   - Maintains backward compatibility with existing plans

8. **Test Results**:
   - Complete end-to-end flow tested and passing ✓
   - Freedom Score calculating correctly (e.g., 56 for age 28, ₹150K income, ₹60K savings) ✓
   - Summary cards displaying correctly with AnimatedCounter ✓
   - All components rendering without errors ✓

### Savings-Based SIP for High-Asset Users (October 16, 2025)
Enhanced SIP calculation to provide actionable investment recommendations even when existing assets already cover retirement corpus:

1. **New Dual-Mode SIP Calculation**:
   - **Gap-Based SIP** (when retirement gap exists): Calculate exact SIP needed to fill the gap using step-up formula
   - **Savings-Based SIP** (when assets cover corpus): Use 80% of monthly savings capacity for wealth building
   - Impact: Users with substantial assets now see meaningful SIP recommendations (e.g., ₹69K) instead of ₹0

2. **Enhanced Verification Logging**: Added `SIP Source: gap-based | savings-based` to calculation logs for debugging and transparency

3. **Test Results**:
   - High-asset user (₹1.2Cr assets, ₹86K monthly savings): SIP = ₹69K (savings-based), Achievement: 343.9% ✓
   - Normal user (no assets, ₹44K monthly savings): SIP = ₹16K (gap-based), Achievement: 100.0% ✓
   - Logic: Wealthy users can build even more wealth instead of being told to invest nothing

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Routing**: Wouter for client-side routing (`/`, `/how-it-works`, `/about-us`, `/onboarding`, `/dashboard`).
- **Authentication**: `useAuth` hook.
- **State Management**: TanStack Query (React Query).
- **UI Components**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS with custom design tokens for theming.
- **Design System**: Custom theme inspired by Material Design principles with a fintech-inspired color palette.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Authentication**: Replit Auth (OAuth) for Google login.
- **API Pattern**: RESTful API for retirement plan CRUD, fund recommendations, and authentication status.
- **Development**: Vite middleware for HMR.

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Database**: Neon PostgreSQL (serverless).
- **Schema**: `users` (OAuth data) and `retirementPlans` (comprehensive financial and personal data, including spouse details, income, assets, goals, risk tolerance, tax preference, calculated projections, and investment recommendations).
- **Data Validation**: Zod schemas integrated with Drizzle.

### Business Logic
- **Calculation Engine**: Server-side calculations (`server/calculations.ts`) for:
    - Corpus requirements with inflation adjustment (6% inflation, 12% buffer).
    - SIP projections with annual step-up (7%).
    - Asset allocation (equity/debt/gold) based on age and risk.
    - Indian tax calculations (new regime, standard deduction, Section 87A rebate, cess).
    - SWP (Systematic Withdrawal Plan) projections.
    - Loan impact analysis.
- **Personalized Investment Recommendations**: Multi-factor engine considering age, risk tolerance, time horizon, investment size, and lifestyle goals to suggest specific mutual funds, bonds, and ETFs with personalized reasoning.
- **Storage Layer**: Abstract `IStorage` interface for database interactions.

### Design Philosophy
- **Hybrid Design**: Reference-based marketing pages (Wealthfront, Vanguard, Zerodha) with systematic design tokens for the dashboard.
- **Progressive Disclosure**: Presenting complex financial data in digestible layers.
- **Indian Context**: Culturally relevant messaging and compliance with Indian tax laws.
- **Accessibility**: Emphasis on trust through simplicity and clear visual hierarchy.

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**
- **wouter**
- **react-hook-form**, **@hookform/resolvers**
- **zod**

### Database & ORM
- **@neondatabase/serverless**
- **drizzle-orm**
- **drizzle-zod**
- **connect-pg-simple**

### UI Component Libraries
- **@radix-ui/** (various packages)
- **cmdk**
- **recharts**
- **lucide-react**
- **class-variance-authority**
- **tailwindcss**, **autoprefixer**

### Development Tools
- **vite**, **@vitejs/plugin-react**
- **typescript**
- **esbuild**
- **tsx**

### Utility Libraries
- **date-fns**
- **clsx**, **tailwind-merge**
- **nanoid**