import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { TrendingUp, Shield, Target, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="relative pt-32 pb-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto space-y-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="max-w-3xl space-y-6"
            variants={fadeInUp}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide">Personalized Plans</span>
            </motion.div>
            
            <h1 className="text-display text-balance">
              Because your golden years deserve the <span className="text-primary">snowball effect</span>
            </h1>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants}>
              <Card 
                className="p-6 space-y-4 card-premium border-border/50 h-full group" 
                data-testid="card-question-debt"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Debt or Investment?</h3>
                  <p className="text-lg font-semibold leading-tight">
                    "Is it wiser to pay off more of my debt or invest the money?"
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Home Loan</span>
                    <span>₹40L</span>
                  </div>
                  <Progress value={65} className="h-1.5" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Investment Portfolio</span>
                    <span>₹15L</span>
                  </div>
                  <Progress value={30} className="h-1.5" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card 
                className="p-6 space-y-4 card-premium border-border/50 h-full group" 
                data-testid="card-question-retirement"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Retirement Goal</h3>
                  <p className="text-lg font-semibold leading-tight">
                    "Am I on the right track to reach my goal?"
                  </p>
                </div>
                <div className="pt-2 space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Progress</div>
                      <div className="text-2xl font-bold text-chart-2">42%</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs text-muted-foreground">Target Age</div>
                      <div className="text-xl font-semibold">60yrs</div>
                    </div>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card 
                className="p-6 space-y-4 card-premium border-border/50 h-full group" 
                data-testid="card-question-early-retirement"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Early Retirement</h3>
                  <p className="text-lg font-semibold leading-tight">
                    "How can I retire early?"
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Current Age</div>
                      <div className="text-xl font-semibold">32</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Target Age</div>
                      <div className="text-xl font-semibold text-chart-2">50</div>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-chart-2 icon-float" />
                    <span>Need ₹8.2L annual SIP with 7% step-up</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            variants={fadeInUp}
          >
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="gradient-button px-8 group" 
                data-testid="button-hero-start"
              >
                Get Your Personalized Plan
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button 
                size="lg" 
                variant="ghost" 
                className="px-8" 
                data-testid="button-learn-more"
              >
                How it works
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-6 justify-center items-center pt-8 text-sm text-muted-foreground"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No Hidden Fees</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Personalized Plans</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>7% Annual Step-up</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
