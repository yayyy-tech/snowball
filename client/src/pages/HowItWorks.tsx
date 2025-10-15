import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { User, Brain, Map, TrendingUp, RefreshCw, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: User,
    title: "It starts with you",
    description: "Your journey begins with a few honest questions - about your age, income, spending habits, lifestyle aspirations, and retirement dreams.",
    detail: "Unlike traditional financial tools that drown you in numbers, Snowball keeps it human. We take into account where you are in life and translate it into a snapshot of your financial health."
  },
  {
    number: "02",
    icon: Brain,
    title: "We decode your financial life",
    description: "Once you share your details, Snowball's engine analyzes income streams, expenses, liabilities, and future goals.",
    detail: "Our system uses intelligent financial modeling to project your long-term outcomes - from retirement corpus to inflation-adjusted expenses. You'll see exactly how your habits shape your financial trajectory."
  },
  {
    number: "03",
    icon: Map,
    title: "Your personalized roadmap",
    description: "Based on your inputs, Snowball builds a step-by-step roadmap designed around your goals and timelines.",
    detail: "It tells you: How much to invest every month • What asset classes to focus on • How your wealth will grow year by year • When and how to rebalance your portfolio."
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "The power of compounding, visualized",
    description: "Snowball helps you see what most people only realize too late - that time is your greatest ally.",
    detail: "We show you how your small, consistent investments can snowball into something extraordinary over decades. Watch your projected wealth curve rise - proof that every rupee builds momentum."
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "We help you stay on track",
    description: "Life changes - promotions, new goals, loans, responsibilities. And Snowball evolves with you.",
    detail: "Whenever your income, lifestyle, or priorities shift, Snowball recalibrates your roadmap automatically. No chasing trends, no panic decisions - just a consistent, data-backed approach."
  },
  {
    number: "06",
    icon: BarChart3,
    title: "Progress you can feel",
    description: "Every time you log in, you'll see not just numbers - but progress.",
    detail: "How close you are to your retirement target. How your monthly discipline is compounding silently. How your future is being built, one decision at a time."
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-mesh">
      <Header />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center space-y-6 mb-20">
              <h1 className="text-display">How Snowball Works</h1>
              <p className="text-subheadline max-w-3xl mx-auto">
                By making financial planning human, visual, and deeply personal. By turning scattered money decisions into a single, rolling strategy.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {steps.map((step) => (
                <Card key={step.number} className="p-8 space-y-4 card-hover border-border/50" data-testid={`step-${step.number}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-5xl font-bold text-muted-foreground/20 leading-none">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-[72px]">
                    <h2 className="text-xl font-semibold">{step.title}</h2>
                    <p className="text-sm text-foreground/80 leading-relaxed">{step.description}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-20 max-w-3xl mx-auto space-y-4">
              <p className="text-lg font-medium">
                That's how Snowball works - by giving you the confidence to stay the course, so your wealth grows quietly, just like a snowball rolling downhill.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
