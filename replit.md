# Snowball Retirement Planner

## Overview

Snowball is a retirement planning web application designed for Indian users aged 25-40. The platform helps users create personalized retirement roadmaps by collecting financial data through a multi-step onboarding questionnaire and generating detailed investment recommendations, corpus calculations, and asset allocation strategies. The application provides smart mutual fund, bond, and gold ETF suggestions tailored to individual risk profiles and financial goals, with calculations based on India's tax regime.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with three main routes:
  - `/` - Landing page with marketing content
  - `/onboarding` - Multi-step questionnaire (9 steps)
  - `/dashboard` - Personalized retirement plan visualization
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for light/dark themes
- **Design System**: Custom theme based on Material Design principles with fintech-inspired color palette (primary: #1A73E8 trust blue)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Pattern**: RESTful API with endpoints for retirement plan CRUD operations
- **Development**: Vite middleware integration for hot module replacement in development
- **Production**: Static file serving with pre-built client assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema**: Two main entities:
  - `users` - User authentication (username/password)
  - `retirementPlans` - Comprehensive retirement plan data including:
    - Personal info with spouse details (name, age, working status) for married users
    - Income data (monthly income for primary earner, spouse income if married and working)
    - Assets, insurance, goals, risk tolerance, tax preferences
    - Emergency fund and health expectations
    - Calculated projections and investment recommendations
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