# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 7-step onboarding questionnaire to collect financial data and generates personalized retirement roadmaps. The platform calculates required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime. The project aims to provide a sophisticated, data-driven financial planning experience.

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