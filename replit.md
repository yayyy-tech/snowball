# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 5-step conversational onboarding flow with AI inference to collect financial data and generates personalized retirement roadmaps with a "Freedom Score" (0-100). The platform calculates the required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime (FY 2024-25). It features an emotionally intelligent UX with Mini-Stories (wisdom quotes) and an AI Advice Bot for contextual nudges. The application is designed for public access without requiring authentication.

## Recent Changes (Oct 25, 2025)

### Onboarding UX Improvement - Direct Amount Inputs (Oct 25)
- **Replaced Percentage Sliders with Direct Inputs**: Step 2 "Money Flow" now uses direct amount inputs instead of percentage sliders
  - **Before**: "What percentage do you save?" slider (0-100%) and "Of your expenses, how much is essential?" slider (30-90%)
  - **After**: "How much do you save each month?" (₹ input) and "What are your monthly expenses?" (₹ input)
- **Auto-Calculated Savings Rate**: System now derives savings rate % from actual amounts (savings/income × 100)
- **Enhanced Live Calculation Display**: Shows savings rate %, total accounted for (savings + expenses), and validation status
- **Comprehensive Validation**: Blocks progression when:
  - Any field is empty
  - Any field contains non-numeric input (regex `/^\d+$/` validation)
  - Income ≤ 0 or savings/expenses < 0
  - Savings + expenses > income (shows clear error: "Please adjust your numbers so that savings + expenses ≤ income")
- **Visual Feedback**: Red error box appears when validation fails, Continue button disabled until fixed
- **Default Essential Expense Ratio**: Set to 60% for backend calculations (reasonable middle-ground assumption)
- **Test Coverage**: E2E test validates all input scenarios including invalid inputs and validation blocking

### PDF Download Feature (Oct 24)
- **Download Retirement Plan**: Users can download their personalized retirement plan as a PDF
- **PDF Content**: Includes user name, retirement summary, investment strategy, asset allocation, Freedom Score, and compounding wisdom quote
- **Quotes**: Random selection from Warren Buffett, Charlie Munger, and Morgan Housel
- **Design**: Clean, minimalist layout with emerald-green and grey tones
- **Snowball Note**: "Remember: Compounding rewards patience. Stick to your plan — and let time do its job."
- **Filename**: `Snowball_Retirement_Plan_[username or date].pdf`
- **Button**: Emerald-styled download button at end of retirement roadmap
- **Toast Notification**: Success message "✅ Your Snowball plan is ready to download!"

### SIP Calculation Logic Overhaul (Oct 23, 2025)
- **Minimum SIP Increased**: Changed from ₹500 to ₹5,000 for meaningful retirement planning (₹60K/year minimum)
- **Affordability-Based Logic**: System now respects user's monthly savings capacity
  - When `monthlySavings >= ₹5,000`: Enforces ₹5K minimum for both gap-based and savings-based calculations
  - When `monthlySavings < ₹5,000`: Caps SIP at user's actual savings capacity (never recommends impossible amounts)
- **Savings-Based SIP** (when assets cover retirement): Uses 60% of monthly savings with affordability checks
- **Gap-Based SIP** (when gap exists): Calculates from corpus gap but caps at savings × 1.2, then applies minimum only if affordable
- **Substantial Assets Detection**: Added `assetCoveragePercentage` and `hasSubstantialAssets` flag (≥70% coverage)
- **Dashboard Notification**: Toast congratulates users whose assets cover ≥70% of retirement corpus
- **Comprehensive Logging**: Server logs warnings when SIP is constrained by low savings capacity

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query (React Query).
- **UI Components**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS with custom design tokens for theming.
- **Design System**: Custom theme inspired by Material Design principles with a fintech-inspired color palette, focusing on progressive disclosure and clear visual hierarchy.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **API Pattern**: RESTful API for retirement plan CRUD, fund recommendations, and status.
- **Development**: Vite middleware for HMR.

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Database**: Neon PostgreSQL (serverless).
- **Schema**: `users` (OAuth data, currently unused due to authentication removal) and `retirementPlans` (comprehensive financial and personal data, including calculated projections and investment recommendations).
- **Data Validation**: Zod schemas integrated with Drizzle.

### Business Logic
- **Calculation Engine**: Server-side calculations (`server/calculations.ts`) for:
    - Corpus requirements with inflation adjustment.
    - SIP projections with annual step-up.
    - Asset allocation (equity/debt/gold) based on age and risk.
    - Indian tax calculations (new regime, standard deduction, Section 87A rebate, cess).
    - SWP (Systematic Withdrawal Plan) projections.
    - Loan impact analysis.
    - Dual-mode SIP calculation (gap-based or savings-based).
- **AI Inference Engine**: Infers monthly expenses, savings rate, lifestyle expenses, calculates Freedom Score, and generates advice triggers.
- **Personalized Investment Recommendations**: Multi-factor engine considering age, risk tolerance, time horizon, investment size, and lifestyle goals to suggest specific mutual funds, bonds, and ETFs.

### Design Philosophy
- **Hybrid Design**: Reference-based marketing pages with systematic design tokens for the dashboard.
- **Progressive Disclosure**: Presenting complex financial data in digestible layers.
- **Indian Context**: Culturally relevant messaging and compliance with Indian tax laws.
- **Accessibility**: Emphasis on trust through simplicity and clear visual hierarchy.

## External Dependencies

### Core Framework Dependencies
- `@tanstack/react-query`
- `wouter`
- `react-hook-form`, `@hookform/resolvers`
- `zod`

### Database & ORM
- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-zod`

### UI Component Libraries
- `@radix-ui/*` (various packages)
- `cmdk`
- `recharts`
- `lucide-react`
- `class-variance-authority`
- `tailwindcss`, `autoprefixer`

### Development Tools
- `vite`, `@vitejs/plugin-react`
- `typescript`
- `esbuild`
- `tsx`

### Utility Libraries
- `date-fns`
- `clsx`, `tailwind-merge`
- `nanoid`