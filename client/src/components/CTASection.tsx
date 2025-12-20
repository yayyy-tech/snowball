import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ctaImage from "@assets/image_1760426945624.png";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-grid-white/10" />
          
          <motion.div 
            variants={contentVariants}
            className="relative z-10 max-w-5xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              No two lives are the same, then why the retirement plan?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              that's why we curate it personalized only for you
            </p>
            <Link href="/onboarding">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-10 py-6 h-auto group"
                data-testid="button-start-planning"
              >
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
