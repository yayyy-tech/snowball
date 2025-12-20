# Snowball Retirement Planner

## Overview
Snowball is a retirement planning web application for Indian users aged 25-40. It guides users through a 5-step conversational onboarding flow with AI inference to collect financial data and generates personalized retirement roadmaps with a "Freedom Score" (0-100). The platform calculates the required corpus, recommends investment strategies, and suggests smart mutual funds, bonds, and gold ETFs tailored to individual risk profiles and financial goals, all based on India's tax regime (FY 2024-25). It features an emotionally intelligent UX with Mini-Stories, an AI Advice Bot for contextual nudges, and comprehensive advanced features including custom Google OAuth authentication, one-time expenses tracking, a What If simulator, and an interactive chatbot assistant.

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
- **Authentication**: Custom Google OAuth using Passport.js (`passport-google-oauth20`) with PostgreSQL-backed sessions (`express-session`, `connect-pg-simple`).
- **Security**: All API endpoints require authentication and enforce ownership verification (`plan.userId === req.user.claims.sub`).

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Database**: Neon PostgreSQL (serverless).
- **Schema**: `users` (OAuth data), `retirementPlans` (financial/personal data, projections, recommendations), `oneTimeExpenses`, and `chatMessages`.
- **Data Validation**: Zod schemas integrated with Drizzle.

### Business Logic
- **Calculation Engine**: Server-side calculations for corpus requirements, SIP projections, asset allocation, Indian tax calculations, SWP projections, loan impact analysis, and dual-mode SIP calculation (gap-based or savings-based). Minimum SIP is ₹5,000, capped by user's savings capacity.
- **AI Inference Engine**: Infers monthly expenses, savings rate, lifestyle expenses, calculates Freedom Score, and generates advice triggers.
- **Personalized Investment Recommendations**: Multi-factor engine considering age, risk tolerance, time horizon, investment size, and lifestyle goals to suggest specific mutual funds, bonds, and ETFs.
- **Advanced Features**:
    - **Previous Plans View**: Users can view all their previously created retirement plans with quick metrics (Freedom Score, age, years to retirement). Organized in a responsive grid with fast loading.
    - **One-Time Expenses Tracking**: Full CRUD API, inflation-adjusted, integrated into corpus calculation.
    - **What If Scenario Simulator**: Claude-powered analysis of user financial scenarios.
    - **Interactive Chatbot Assistant**: Claude-powered, context-aware advice, with persistent chat history.
    - **Interactive Charts**: Recharts integration for asset allocation visualization.
    - **PDF Download**: Premium 4-page dark-themed PDF with branded Snowball design. Includes: Page 1 (Freedom Score hero with progress ring, key metrics), Page 2 (Detailed calculation breakdown with accumulation/withdrawal phases), Page 3 (Asset allocation with visual bars and rationale), Page 4 (SIP recommendations and investment suggestions). Features compounding wisdom quotes from Buffett, Munger, and Housel.

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
- `passport`, `passport-google-oauth20`
- `express-session`, `connect-pg-simple`

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

### AI Integration
- Claude 3.5 Sonnet (via `server/utils/claude.ts`)

### Analytics Integration
- Mixpanel (via `client/src/lib/mixpanel.ts`) - Tracks user logins, plan creation, page views, and key user actions. Requires `VITE_MIXPANEL_TOKEN` environment variable.

### Utility Libraries
- `date-fns`
- `clsx`, `tailwind-merge`
- `nanoid`