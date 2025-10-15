import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, BarChart3, PiggyBank, FileText, Calculator } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

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
  const { ref, isVisible } = useScrollAnimation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="features" className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold">
            Everything You Need for <span className="gradient-text">Retirement Planning</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to help you build wealth for your golden years
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card 
                className="p-6 card-hover border-2 shadow-lg h-full"
                data-testid={`card-feature-${index}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
