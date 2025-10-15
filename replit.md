# Snowball Retirement Planner

## Overview

Snowball is a retirement planning web application designed for Indian users aged 25-40. The platform helps users create personalized retirement roadmaps by collecting financial data through a streamlined 7-step onboarding questionnaire and generating detailed investment recommendations, corpus calculations, and asset allocation strategies. The application provides smart mutual fund, bond, and gold ETF suggestions tailored to individual risk profiles and financial goals, with calculations based on India's tax regime.

## Recent Changes (October 2025)

### Critical Calculation & Display Fixes (Latest)
Complete overhaul of tax calculations and dashboard display components:

1. **Tax Calculation Update (FY 2024-25)**: Fixed outdated tax slabs to match India's new tax regime per Union Budget 2024
   - Updated slabs: ₹3-7L (5%), ₹7-10L (10%), ₹10-12L (15%), ₹12-15L (20%), >₹15L (30%)
   - Added ₹75,000 standard deduction for salaried individuals (increased from ₹50,000)
   - Implemented Section 87A rebate (zero tax for income ≤ ₹7 lakh)
   - Added 4% health & education cess on tax amount
   - Previous version used outdated ₹6-9L slab which caused incorrect tax calculations for middle-income users

2. **AnimatedCounter Display Fix**: Resolved dashboard summary cards showing "0" instead of calculated values
   - Root cause: Component initialized spring animation at 0 and used hasAnimated flag that blocked updates
   - Fix: Initialize spring with actual value, removed blocking flag, simplified update logic
   - Now displays Years to Retirement, Corpus, and SIP amounts correctly on first render
   - Verified via end-to-end testing: 30yo user retiring at 60 now sees "30" years, not "0"

3. **Comprehensive Calculation Review**: Verified all retirement planning formulas are mathematically accurate
   - Corpus calculation: Growing annuity formula with 6% inflation, 7% returns, 12% buffer
   - SIP calculation: Step-up formula with 7% annual increase, monthly compounding
   - Asset allocation: 100-age rule with risk tolerance adjustments (conservative/moderate/aggressive)
   - SWP projections: Inflation-adjusted withdrawals from age 60-85
   - All formulas verified against financial planning best practices

### The Financialist-Inspired Redesign
Complete visual overhaul to match The Financialist's sophisticated, data-driven aesthetic:

1. **Refined Color Palette**: Updated CSS variables to muted, sophisticated tones (primary: 220 60% 45%, reduced saturation across all chart colors)
2. **Subtle Shadows**: Replaced heavy shadows with refined, barely-there depth (shadow-xl: 0px 12px 20px -4px hsl(220 13% 18% / 0.09))
3. **Question-Driven Hero**: Redesigned hero section with 3 interactive cards showing user dilemmas (Debt vs Investment, Retirement Track, Early Retirement) with inline data visualizations
4. **Typography Enhancements**: Added text-display, text-headline, text-subheadline utility classes with improved line-height, letter-spacing, and hierarchy
5. **Numbered Step Badges**: Updated How It Works page with large "01, 02, 03" badges in 2-column grid layout
6. **Data-Driven Features**: Added inline metrics to each feature card (e.g., "₹2.4Cr Avg. Corpus Target", "7% Annual Step-up")
7. **Simplified Gradients**: Replaced vibrant multi-color gradients with subtle 2-tone radial patterns (gradient-mesh uses 0.03 opacity)
8. **Dashboard Refinements**: Updated summary cards with uppercase labels, refined spacing, and cleaner visual hierarchy
9. **Softer Interactions**: Reduced card-hover transform from -4px to -2px, subtle transitions throughout
10. **Increased White Space**: Better breathing room with larger padding and margins across all sections

### Previous Updates
1. **Risk Tolerance Validation**: Fixed frontend onboarding form to send "moderate" instead of "balanced" for the balanced risk option, matching backend validation that expects conservative/moderate/aggressive values
2. **Personalized Fund Reasoning**: Enhanced fund recommendation engine to receive full user context (age, retirementAge, lifestyle, monthlyExpenses) so each fund recommendation includes personalized reasoning mentioning user-specific factors like "young investor", "long investment horizon", "comfortable lifestyle", etc.
3. **Session Cookie Security**: Made session cookie settings environment-aware (secure: false in development/testing, secure: true in production) to support OIDC testing while maintaining production security
4. **Test Coverage**: End-to-end testing validates full authentication flow, onboarding completion, plan creation, and personalized reasoning display
5. **Onboarding Step Reordering**: Changed questionnaire step order from "Personal → Income → Liabilities → Assets → Goals → Risk → Tax" to "Personal → Income → Assets → Liabilities → Goals → Risk → Tax" (moved Assets before Liabilities for better logical flow)
6. **Indian Number Formatting**: Added formatIndianNumber/parseIndianNumber utilities to display all monetary inputs with Indian comma grouping (e.g., 15,00,000) while keeping Age fields as plain numbers
7. **Dashboard Cleanup**: Removed AI-Powered Insights section and fund expansion controls to streamline the dashboard interface
8. **Exit-Intent Popup**: Added beforeunload event handler that shows a browser confirmation dialog when users try to close or refresh the tab, with the message "Don't exit now. You'd be walking away from decades of compounding that could secure your golden years." (Note: Modern browsers may show a generic message instead of the custom text for security reasons)
9. **Sample Roadmap Preview**: Added preview section on landing page displaying sample dashboard screenshots (asset allocation chart and recommended investments) with "Sample Roadmap" heading, positioned between Features and How It Works sections
10. **Enhanced How It Works Content**: Expanded How It Works section with detailed 6-step journey explaining the complete Snowball process from initial questionnaire to ongoing progress tracking, with personalized explanations for each step
11. **About Us Section**: Added comprehensive About Us section to landing page with company philosophy, vision, team background, and promises. Added "About Us" navigation link in header for easy access
12. **Dedicated Pages**: Created separate pages for "How It Works" (/how-it-works) and "About Us" (/about-us), removed these sections from homepage for cleaner navigation
13. **Monthly Savings Calculator**: Added automatic monthly savings calculation in Income step showing: Monthly Income (annual income ÷ 12), Total Monthly Expenses (sum of all monthly expenses), and Monthly Savings (income - expenses) with Indian number formatting

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with five main routes:
  - `/` - Landing page with hero, sample roadmap preview, features, testimonials, and CTA
  - `/how-it-works` - Detailed 6-step explanation of the Snowball process
  - `/about-us` - Company philosophy, vision, team background, and promises
  - `/onboarding` - Streamlined 7-step questionnaire (Personal, Income, Assets, Liabilities, Goals, Risk, Tax)
  - `/dashboard` - Personalized retirement plan visualization with fund recommendations
- **Authentication**: useAuth hook for checking authentication status, login/logout functionality
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for light/dark themes
- **Design System**: Custom theme based on Material Design principles with fintech-inspired color palette (primary: #1A73E8 trust blue)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Authentication**: Replit Auth (OAuth) for Google login (also supports GitHub, X, Apple, email/password)
- **API Pattern**: RESTful API with endpoints for:
  - Retirement plan CRUD operations
  - Fund recommendations (mutual funds and debt funds)
  - User authentication status
- **Development**: Vite middleware integration for hot module replacement in development
- **Production**: Static file serving with pre-built client assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema**: Two main entities:
  - `users` - OAuth user data (email, firstName, lastName, profileImageUrl)
  - `retirementPlans` - Comprehensive retirement plan data including:
    - Personal info with spouse details (name, age, working status) for married users
    - Income data (monthly income for primary earner, spouse income if married and working)
    - Assets (real estate, stocks, mutual funds, PPF/EPF/NPS, bank deposits, gold)
    - Retirement goals (desired age, lifestyle expectations, monthly expenses)
    - Risk tolerance and preferred asset allocation
    - Tax regime preference (new vs old)
    - Calculated projections and investment recommendations
    - Note: Insurance, emergency fund, and health data fields have been removed as they don't affect calculations
- **Data Validation**: Zod schemas for runtime validation with Drizzle integration

### Business Logic
- **Calculation Engine**: Server-side retirement planning calculations (`server/calculations.ts`) including:
  - Corpus requirements with inflation adjustment (6% fixed inflation, 12% buffer)
  - SIP projections with annual step-up (7%)
  - Asset allocation recommendations (equity/debt/gold) based on age and risk profile
  - Tax calculations based on India's new tax regime
  - SWP (Systematic Withdrawal Plan) projections with inflation-adjusted withdrawals
  - Loan impact analysis
- **Personalized Investment Recommendations**: Multi-factor recommendation engine that selects specific mutual funds, bonds, and ETFs based on:
  - **Age Groups**: Young (<35), Middle-aged (35-50), Near-retirement (50+)
  - **Risk Tolerance**: Aggressive (small cap, midcap), Moderate (flexi cap, large cap), Conservative (index funds, hybrid)
  - **Time Horizon**: Long (20+ years), Medium (10-20 years), Short (<10 years)
  - **Investment Size**: Small (<₹10K), Medium, Large (₹50K+) investors get different fund options
  - **Lifestyle Goals**: Each recommendation includes personalized reasoning referencing user's specific goals
  - **Fund Variety**: 15+ different funds across equity, debt, and gold categories - NO static recommendations
- **Storage Layer**: Abstract storage interface (`IStorage`) with database implementation for testability

### Design Philosophy
- **Hybrid Design Approach**: Reference-based marketing pages (inspired by Wealthfront, Vanguard, Zerodha) combined with systematic design tokens for dashboard functionality
- **Progressive Disclosure**: Complex financial data revealed in digestible layers
- **Indian Context**: Culturally relevant messaging and compliance with Indian tax laws
- **Accessibility**: Focus on trust through simplicity with clear visual hierarchy

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query** - Server state management and data fetching
- **wouter** - Lightweight client-side routing
- **react-hook-form** with **@hookform/resolvers** - Form state management and validation
- **zod** - Schema validation

### Database & ORM
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver with WebSocket support
- **drizzle-orm** - Type-safe ORM
- **drizzle-zod** - Zod schema generation from Drizzle schemas
- **connect-pg-simple** - PostgreSQL session store for Express

### UI Component Libraries
- **@radix-ui/** packages - Unstyled, accessible component primitives (30+ components including dialog, dropdown, select, tabs, etc.)
- **cmdk** - Command menu component
- **recharts** - Chart visualization library
- **lucide-react** - Icon library
- **class-variance-authority** - CSS variant management
- **tailwindcss** with **autoprefixer** - Utility-first CSS framework

### Development Tools
- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **typescript** - Type safety
- **esbuild** - Production server bundling
- **tsx** - TypeScript execution for development

### Utility Libraries
- **date-fns** - Date manipulation
- **clsx** & **tailwind-merge** - Conditional className utilities
- **nanoid** - Unique ID generation