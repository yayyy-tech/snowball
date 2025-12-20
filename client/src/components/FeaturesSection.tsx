import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, BarChart3, PiggyBank, FileText, Calculator } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const features = [
  {
    icon: TrendingUp,
    title: "Personalized Retirement Roadmap",
    description: "Get a custom investment plan based on your age, income, goals, and risk appetite",
    metric: "₹2.4Cr",
    metricLabel: "Avg. Corpus Target"
  },
  {
    icon: BarChart3,
    title: "Smart Fund Suggestions",
    description: "Recommendations from 40+ top-rated mutual funds, bonds, and gold ETFs",
    metric: "15+",
    metricLabel: "Fund Categories"
  },
  {
    icon: Calculator,
    title: "Tax-Optimized Planning",
    description: "Calculations based on India's new tax regime to maximize your returns",
    metric: "12%",
    metricLabel: "Avg. Tax Savings"
  },
  {
    icon: PiggyBank,
    title: "SIP Step-up Planning",
    description: "Smart SIP recommendations with automatic 7% annual step-up calculations",
    metric: "7%",
    metricLabel: "Annual Step-up"
  },
  {
    icon: FileText,
    title: "Comprehensive Projections",
    description: "Detailed reports including SWP calculations and inflation-adjusted spending",
    metric: "6%",
    metricLabel: "Inflation Factor"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial information is encrypted and never shared with third parties",
    metric: "100%",
    metricLabel: "Data Privacy"
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-16"
        >
          <motion.div
            variants={headingVariants}
            className="text-center space-y-4"
          >
            <h2 className="text-headline text-balance">
              All your financial needs, under one roof
            </h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Comprehensive tools and insights to help you build wealth for your golden years
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card 
                  className="p-6 card-premium border-border/50 h-full group"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                      <feature.icon className="h-6 w-6 text-primary icon-float" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{feature.metric}</div>
                      <div className="text-xs text-muted-foreground">{feature.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
