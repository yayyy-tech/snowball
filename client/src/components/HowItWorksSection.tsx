import { User, Brain, Map, TrendingUp, RefreshCw, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: User,
    title: "It starts with you.",
    description: "Your journey begins with a few honest questions - about your age, income, spending habits, lifestyle aspirations, and retirement dreams. We're not here to judge or sell. We're here to understand.",
    detail: "Unlike traditional financial tools that drown you in numbers, Snowball keeps it human. We take into account where you are in life - whether you're saving your first lakh or already investing steadily - and translate it into a snapshot of your financial health. Every piece of data you share helps us build a financial fingerprint unique to you."
  },
  {
    icon: Brain,
    title: "We decode your financial life.",
    description: "Once you share your details, Snowball's engine goes to work - analyzing income streams, expenses, liabilities, and future goals.",
    detail: "Our system uses intelligent financial modeling (the same methods used by wealth managers) to project your long-term outcomes - from retirement corpus to inflation-adjusted expenses. The goal? To help you understand what's really happening behind your numbers. You'll see exactly how your savings and spending habits shape your financial trajectory - and what needs to change to reach financial freedom."
  },
  {
    icon: Map,
    title: "Your personalized roadmap.",
    description: "Based on your inputs, Snowball builds a step-by-step roadmap designed around your goals and timelines. This roadmap isn't generic - it's a living plan.",
    detail: "It tells you: How much to invest every month • What asset classes to focus on (equity, debt, gold, etc.) • How your wealth will grow year by year • When and how to rebalance your portfolio. It's clarity without complexity - you don't need to be a financial expert to understand it."
  },
  {
    icon: TrendingUp,
    title: "The power of compounding, visualized.",
    description: "Snowball helps you see what most people only realize too late - that time is your greatest ally.",
    detail: "We show you how your small, consistent investments can snowball into something extraordinary over decades. You'll watch your projected wealth curve rise - proof that every rupee you invest today builds momentum for tomorrow. This isn't just motivation; it's perspective. Because once you see compounding in action, you'll never want to stop the snowball from rolling."
  },
  {
    icon: RefreshCw,
    title: "We help you stay on track.",
    description: "Life changes - promotions, new goals, loans, responsibilities. And Snowball evolves with you.",
    detail: "Whenever your income, lifestyle, or priorities shift, Snowball recalibrates your roadmap automatically. It ensures that even when your life gets unpredictable, your long-term plan stays steady. No chasing trends, no panic decisions - just a consistent, data-backed approach that keeps your money working for you."
  },
  {
    icon: BarChart3,
    title: "Progress you can feel.",
    description: "Every time you log in, you'll see not just numbers - but progress. How close you are to your retirement target. How your monthly discipline is compounding silently in the background.",
    detail: "How your future is being built, one decision at a time. Snowball keeps you emotionally connected to your journey - because when you feel progress, you stay consistent."
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            By making financial planning human, visual, and deeply personal. By turning scattered money decisions into a single, rolling strategy.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              <div className="bg-background rounded-2xl p-6 md:p-8 border border-border">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
                      <step.icon className="h-8 w-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold">{step.title}</h3>
                    <p className="text-base text-foreground/90">{step.description}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-lg font-medium text-foreground">
            That's how Snowball works - by giving you the confidence to stay the course, so your wealth grows quietly, just like a snowball rolling downhill.
          </p>
        </div>
      </div>
    </section>
  );
}
