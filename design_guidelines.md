# Snowball Retirement Planner - Design Guidelines

## Design Philosophy

**Theme**: Compounding Momentum / The Golden Effect  
**Vibe**: Futuristic, Aspirational, Professional, High-Engagement  
**Core Goal**: Maximize completion of the 7-step process by treating it as a seamless, visually-rewarding journey (Mission Control Dashboard style)

## Color Palette

### Primary Colors

- **Deep Momentum** (`#0C101A`) - Main background (90% coverage)
  - Use for: Page backgrounds, card backgrounds in dark mode
  - CSS Variable: `--deep-momentum`

- **Golden Accent** (`#FFC72C`) - Completed steps, positive reinforcement
  - Use for: Completed step indicators, calculated results, success states, key data visualization
  - CSS Variable: `--golden-accent`

- **Teal Clarity** (`#00C4CC`) - Active states and primary actions
  - Use for: Active step indicators, primary CTA buttons, input focus states
  - CSS Variable: `--teal-clarity`

### Neutral Colors

- **Stellar White** (`#F0F4F8`) - Primary text and content
  - Use for: Primary text, form input text, card content backgrounds
  - CSS Variable: `--stellar-white`

- **Nebula Grey** (`#343A40`) - Secondary elements
  - Use for: Secondary text, pending/disabled states, input borders, subtle dividers
  - CSS Variable: `--nebula-grey`

## Typography

### Font Families

- **Headlines**: Sora (Bold, ExtraBold)
  - Use for: Tagline, step titles, main headings (H1, H2)
  
- **Body & UI**: Inter (Medium, Regular)
  - Use for: Sub-headlines, form labels, input text, body copy

### Font Sizing

- **Tagline (Desktop)**: 4.5rem (72px)
- **H1**: 3rem (48px)
- **H2**: 2rem (32px)
- **Sub-headline**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

## Landing Page Hero

### Layout
- Full viewport height (100vh)
- Centered content with Z-layering

### Elements

1. **Background Animation**
   - Drifting particles (CSS/SVG)
   - Colors: Teal Clarity and Golden Accent
   - Opacity: 0.05 (ambient)
   - Z-index: 0

2. **Tagline**
   - Text: "Because your golden years deserve a golden effect."
   - Font: Sora ExtraBold, Stellar White
   - Size: 4.5rem (desktop)

3. **Sub-headline**
   - Text: "The 7-Step Planner designed to turn today's savings into tomorrow's wealth. Watch your future compound."
   - Font: Inter Regular, Nebula Grey
   - Size: 1.25rem

4. **CTA Button**
   - Text: "Start the SnowBall Effect →"
   - Background: Teal Clarity
   - Text: Stellar White
   - Hover: Background to #00A3A8, arrow translates right 5px
   - Z-index: 2

## Step-by-Step Onboarding UI

### Structure

- **Background**: Deep Momentum (#0C101A) full screen
- **Layout**: Side-by-side panels

#### Progress Navigator Panel (Left)
- Width: 25%
- Position: Fixed
- Border: 1px solid Nebula Grey on right edge
- Contains: Step list with indicators

#### Main Input Panel (Right)
- Width: 70%
- Design: Glassmorphism
  - Background: `rgba(240, 244, 248, 0.05)`
  - Backdrop filter: `blur(20px)`
  - Border: `1px subtle glow in rgba(255, 199, 44, 0.2)`
  - Padding: 40px (generous)

### Step States

1. **Active Step**
   - Text: Stellar White
   - Indicator: Pulsing filled circle in Teal Clarity

2. **Pending Step**
   - Text: Nebula Grey
   - Indicator: Outlined circle in Nebula Grey

3. **Completed Step**
   - Text: Stellar White
   - Indicator: Solid Golden Accent with checkmark

### Step Titles

1. "The Launchpad: Personal Profile"
2. "Fueling the Engine: Earning Power"
3. "Current Inventory: Assets & Wealth"
4. "Clearing the Path: Debts & Liabilities"
5. "The Target: Defining Your Ambition"
6. "Risk Velocity: Your Tolerance Gauge"
7. "The Efficiency Engine: Tax Optimization"

### Input Fields

- **Standard Inputs**
  - Transparent background
  - 1px bottom border in Nebula Grey
  - Focus: Border transitions to 3px solid Teal Clarity

- **Age Slider** (Custom)
  - Track: Nebula Grey
  - Handle: Golden Accent
  - Visual: Golden Accent bar extends on timeline above slider

- **Validation Animation**
  - Quick ripple of Golden Accent on successful completion

### Transitions

- **Duration**: 300ms for all transitions
- **Next Button**: "Ready for [Next Step] →"
- **Step Completion Sequence**:
  1. Current card slides left & fades out
  2. Sidebar indicator snaps to Golden Accent with checkmark
  3. Next sidebar indicator pulses Teal Clarity
  4. New card slides in from right

## Dashboard

### Design Principles
- Maintain Deep Momentum background
- Use glassmorphism for card containers
- Golden Accent for positive metrics (corpus achieved, gains)
- Teal Clarity for action items and interactive elements

### Data Visualization
- Charts use Golden Accent and Teal Clarity as primary colors
- Stellar White for labels and text
- Nebula Grey for grid lines and secondary elements

## Interactive Elements

### Buttons
- **Primary**: Teal Clarity background, Stellar White text
- **Secondary**: Transparent background, Teal Clarity border
- **Success**: Golden Accent background, Deep Momentum text

### Hover States
- Subtle scale transform (1.02)
- Color shift to darker shade
- Smooth transitions (200ms)

### Focus States
- 3px solid Teal Clarity outline
- Glow effect with Teal Clarity

## Animations

### Micro-interactions
- Input validation: Ripple effect in Golden Accent
- Step completion: Confetti burst of Golden Accent particles
- Progress: Smooth bar fills with gradient (Teal → Golden)

### Page Transitions
- Slide and fade (300ms ease-in-out)
- Stagger animations for list items (50ms delay between items)

## Accessibility

- Maintain WCAG AA contrast ratios
- Golden Accent (#FFC72C) on Deep Momentum (#0C101A): 8.5:1 ✓
- Stellar White (#F0F4F8) on Deep Momentum (#0C101A): 15.2:1 ✓
- Teal Clarity (#00C4CC) on Deep Momentum (#0C101A): 7.8:1 ✓

## Spacing Scale

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Border Radius

- **sm**: 0.375rem (6px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)
- **full**: 9999px (pills)
