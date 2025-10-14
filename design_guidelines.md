# Snowball Retirement Planner - Design Guidelines

## Design Approach
**Hybrid Approach**: Reference-based for marketing pages (inspired by fintech leaders like Wealthfront, Vanguard, Zerodha) + Design System foundation (Material Design) for dashboard/app functionality.

**Design Principles**:
- Trust through simplicity: Clean layouts that inspire confidence in financial decisions
- Data visualization clarity: Charts and numbers presented with hierarchy and breathing room
- Progressive disclosure: Complex financial data revealed in digestible layers
- Indian context awareness: Culturally relevant iconography and messaging

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: `217 83% 53%` (#1A73E8 - Trust blue)
- Background: `0 0% 98%` (Off-white)
- Surface: `0 0% 100%` (Pure white cards)
- Text Primary: `220 13% 18%` (Charcoal gray)
- Text Secondary: `220 9% 46%` (Medium gray)
- Success: `142 76% 36%` (Wealth green)
- Warning: `38 92% 50%` (Alert amber)
- Chart Colors: `217 83% 53%`, `142 76% 36%`, `280 67% 48%`, `24 90% 53%`

**Dark Mode**:
- Primary: `217 83% 63%` (Lighter blue)
- Background: `220 13% 9%` (Deep charcoal)
- Surface: `220 13% 13%` (Elevated cards)
- Text Primary: `0 0% 95%` (Near white)
- Text Secondary: `220 9% 70%` (Light gray)

### B. Typography

**Font Families**: Inter (primary), Poppins (headings alternate)

**Scale**:
- Hero Heading: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- Section Heading: text-3xl md:text-4xl, font-semibold
- Card Title: text-xl md:text-2xl, font-semibold
- Body Large: text-lg, font-normal
- Body: text-base, font-normal
- Caption: text-sm, text-muted-foreground
- Financial Data: text-2xl md:text-3xl, font-bold, tabular-nums

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 md:p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-4 md:px-8

**Grid System**:
- Landing sections: Single column on mobile, 2-3 columns on desktop
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature showcase: grid-cols-1 md:grid-cols-3

### D. Component Library

**Navigation**:
- Sticky header with backdrop-blur-lg bg-white/80 dark:bg-gray-900/80
- Logo left, nav center, CTA button right
- Mobile: Hamburger menu with slide-in drawer

**Cards**:
- Base: rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition
- Investment Cards: Include icon, title, subtitle, metrics row, "View Details" button
- Stat Cards: Large number display with trend indicator and sparkline

**Buttons**:
- Primary: rounded-xl bg-primary text-white px-6 py-3 font-semibold hover:bg-primary/90
- Secondary: rounded-xl border border-primary text-primary px-6 py-3 hover:bg-primary/5
- On Image: rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3

**Forms**:
- Input fields: rounded-lg border bg-background px-4 py-3 focus:ring-2 focus:ring-primary
- Progress bar: Multi-step with filled circles and connecting lines
- Radio/Checkbox: Custom styled with primary color accent

**Charts** (Recharts):
- Pie Chart: Allocation with custom colors, center label showing total
- Line Chart: Projection timeline with gradient fill
- Bar Chart: Comparative returns with hover tooltips

**Data Display**:
- Tables: Striped rows, sticky headers, sortable columns
- Metrics Grid: 2x2 or 3x3 grid of key numbers with icons
- Comparison Cards: Side-by-side fund comparison with highlighting

---

## Page-Specific Guidelines

### Landing Page

**Hero Section** (h-screen):
- Large hero image (right 50%): Indian family/couple planning together, warm lighting, aspirational
- Left 50%: Headline + subtext + dual CTAs ("Start Planning" primary, "Learn More" secondary)
- Floating trust indicators: "Trusted by 10,000+ users" badge

**Features Section** (py-20):
- 3-column grid with icon-title-description cards
- Icons: Custom financial illustrations (calculator, roadmap, shield)
- Background: Subtle gradient mesh

**How It Works** (py-24):
- Horizontal timeline (desktop) / vertical (mobile)
- Step numbers in large circles, connected by dotted lines
- Each step: Icon + heading + description + micro-illustration

**Testimonials** (py-20):
- Carousel with 2 cards visible (desktop), 1 (mobile)
- User photo, name, age, quote, star rating
- Auto-rotate every 5 seconds

**Final CTA Section** (py-24):
- Centered design with gradient background
- Calculator illustration
- "Start Your Journey" primary CTA + "No credit card required" subtext

### Onboarding Questionnaire

**Layout**:
- Centered form card (max-w-2xl) with progress indicator at top
- Question title (text-2xl), helper text (text-muted-foreground)
- Input fields with validation states (error red, success green)
- Navigation: "Back" ghost button left, "Continue" primary right

**Question Types**:
- Number inputs: Large font, clear units (₹, years)
- Risk tolerance: Visual slider with emoji indicators
- Multiple choice: Card-based selection with hover/active states
- Loan details: Expandable accordion per loan

**Special Sections**:
- Dependents: Add/remove cards with animation
- Kids planning: Toggle with conditional fields (education/wedding checkboxes)

### Dashboard

**Header**:
- Personalized greeting: "Hi, [Name]! Here's your Retirement Roadmap"
- Quick actions: Recalculate, Export PDF, Compare

**Allocation Section**:
- Left: Donut chart (Recharts) with center total
- Right: List breakdown with color-coded bars

**Recommendations Grid**:
- Tabbed interface: Mutual Funds | Bonds | Gold ETFs
- Cards show: Name, category, key metrics, "View Details" expansion
- Each card includes source badge and rating stars

**Projections Section**:
- Timeline chart showing corpus growth with step-up SIPs
- Post-retirement SWP calculator: Input expected age → Output monthly withdrawal
- Inflation-adjusted spending display

**Warnings/Disclaimers**:
- Alert card (border-l-4 border-warning) with icon
- Pale yellow background, clear typography

---

## Images

**Hero Image**: Professional photo of Indian couple (30s) reviewing financial documents on laptop, smiling, modern home setting. Warm natural lighting. Place on right 50% of hero section.

**Feature Icons**: Use Heroicons (outline) - calculator, chart-bar, shield-check for features section

**Testimonials**: Use placeholder avatar images or initials in colored circles

**Dashboard**: Include chart visualizations (generated by Recharts), no static images needed

---

## Animations

Use Framer Motion sparingly:
- Page transitions: Fade + slight y-offset (20px)
- Card hover: Scale(1.02) + shadow increase
- Number counting: Animate corpus/returns on dashboard load
- Progress bar: Smooth width transition in onboarding

---

## Accessibility & Dark Mode

- All interactive elements: min 44px touch target
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Dark mode: Toggle in header, persisted to localStorage
- Form inputs: Consistent dark mode styling with proper borders
- Charts: Maintain readability in both modes with appropriate color adjustments