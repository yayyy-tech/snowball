import { FileText, LineChart, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Tell us about yourself",
    description: "Share your financial profile, goals, and risk appetite through our simple questionnaire.",
  },
  {
    icon: LineChart,
    title: "Get your investment roadmap",
    description: "Receive personalized recommendations for mutual funds, bonds, and gold ETFs.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description: "Monitor your retirement corpus growth and adjust your plan as needed.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start planning your retirement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 border-t-2 border-dashed border-muted-foreground/30" />
              )}
              
              <div className="relative bg-background rounded-2xl p-6 text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
