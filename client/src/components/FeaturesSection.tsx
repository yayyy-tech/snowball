import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, BarChart3, PiggyBank, FileText, Calculator } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Personalized Retirement Roadmap",
    description: "Get a custom investment plan based on your age, income, goals, and risk appetite.",
  },
  {
    icon: BarChart3,
    title: "Smart Mutual Fund & Bond Suggestions",
    description: "AI-powered recommendations from top-rated funds, corporate bonds, and gold ETFs.",
  },
  {
    icon: Shield,
    title: "Secure and Private Data",
    description: "Your financial information is encrypted and never shared with third parties.",
  },
  {
    icon: Calculator,
    title: "Advanced Tax Calculations",
    description: "Calculations based on India's new tax regime to maximize your returns.",
  },
  {
    icon: PiggyBank,
    title: "SIP Step-up Planning",
    description: "Smart SIP recommendations with automatic 7% annual step-up calculations.",
  },
  {
    icon: FileText,
    title: "Comprehensive Reports",
    description: "Detailed projections including SWP calculations and inflation-adjusted spending.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Everything You Need for Retirement Planning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to help you build wealth for your golden years
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover-elevate transition-all duration-300"
              data-testid={`card-feature-${index}`}
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
