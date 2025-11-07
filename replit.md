# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 5-step conversational onboarding flow with AI inference to collect financial data and generates personalized retirement roadmaps with a "Freedom Score" (0-100). The platform calculates the required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime (FY 2024-25). It features an emotionally intelligent UX with Mini-Stories (wisdom quotes), an AI Advice Bot for contextual nudges, and comprehensive advanced features including Google Auth, one-time expenses tracking, What If simulator, and interactive chatbot assistant.

## Recent Changes (Nov 7, 2025)

### Five Advanced Features Implementation (Nov 7)
Completed full-stack implementation of all 5 advanced features with Claude AI integration:

#### 1. Google Authentication Integration
- **Auth UI in Header**: Login/logout buttons with user avatar display
- **useAuth Hook**: Provides user state, isAuthenticated flag, and login/logout functions
- **Session Management**: Leverages existing Replit Auth infrastructure at /api/login and /api/logout
- **Mixed Auth Model**: App supports both guest users (retirement plans without userId) and authenticated users (full feature access)
- **Auth Gating**: One-time expenses, What If simulator, and chatbot require authentication

#### 2. One-Time Expenses Tracking
- **Backend API**: Full CRUD endpoints at /api/expenses (GET, POST, DELETE)
- **Database Schema**: New `oneTimeExpenses` table with name, estimatedCost, inflationAdjustedCost, targetYear, retirementPlanId, userId
- **Inflation Adjustment**: Expenses automatically adjusted based on target year and 6% inflation
- **Corpus Integration**: Expenses included in totalCorpusNeeded calculation via fetchAndIncludeExpenses()
- **Frontend Component**: ExpensesManager with add/delete UI, form validation, and live updates
- **Auto-Recalculation**: Adding/deleting expenses invalidates retirement plan cache, triggering fresh calculation

#### 3. What If Scenario Simulator (Claude-Powered)
- **Claude Integration**: Uses Claude 3.5 Sonnet via server/utils/claude.ts
- **API Endpoint**: POST /api/what-if analyzes user scenario questions
- **Context-Aware**: Marshals retirement plan data (corpus, SIP, investments, taxes) to Claude
- **Frontend Component**: WhatIfSimulator with question input, loading states, and formatted AI responses
- **Auth Required**: Simulator accessible only to logged-in users
- **Example Questions**: "What if I retire 5 years early?", "What if inflation is 8% instead of 6%?"

#### 4. Interactive Chatbot Assistant (Claude-Powered)
- **Floating Widget**: ChatbotWidget component with collapsible UI and message history
- **Chat History**: New `chatMessages` table stores user messages and AI responses
- **API Endpoints**: POST /api/chat for new messages, GET /api/chat/history for history
- **Context Marshaling**: Sends retirement plan context to Claude for personalized advice
- **Real-time Updates**: 3-second polling for chat history when widget is open
- **Session Persistence**: Chat history tied to userId for continuity across sessions

#### 5. Interactive Charts (Already Implemented)
- **Recharts Integration**: PieChart for asset allocation (equity/debt/gold)
- **Responsive Design**: Charts adapt to screen size and theme (light/dark mode)
- **Color Coding**: Semantic colors matching theme tokens for visual consistency
- **Data Visualization**: Displays allocation percentages and absolute values

### Technical Architecture Updates
- **Claude Integration**: Centralized utilities in server/utils/claude.ts with error handling and context marshaling
- **Auth Middleware**: New optionalAuth middleware allows mixed public/private routes
- **Storage Layer**: Extended IStorage interface with createExpense, deleteExpense, createChatMessage, getChatHistory methods
- **Database Extensions**: Added oneTimeExpenses and chatMessages tables with proper foreign keys
- **Frontend Integration**: All components integrated into Dashboard with proper auth checks and error handling
- **API Request Pattern**: Updated components to use apiRequest(method, url, data) signature correctly

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