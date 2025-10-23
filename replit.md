# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 5-step conversational onboarding flow with AI inference to collect financial data and generates personalized retirement roadmaps with a "Freedom Score" (0-100). The platform calculates the required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime (FY 2024-25). It features an emotionally intelligent UX with Mini-Stories (wisdom quotes) and an AI Advice Bot for contextual nudges. The application is designed for public access without requiring authentication.

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