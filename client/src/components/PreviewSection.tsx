import assetAllocationImage from "@assets/image_1760463234725.png";
import recommendedInvestmentsImage from "@assets/Screenshot 2025-10-14 230405_1760493135971.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

export function PreviewSection() {
  const { ref, isVisible } = useScrollAnimation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headingVariants = {
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

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <motion.div 
          className="max-w-6xl mx-auto space-y-10"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2
            variants={headingVariants}
            className="text-3xl md:text-4xl font-bold text-center text-balance"
            data-testid="heading-sample-roadmap"
          >
            Sample <span className="gradient-text">Roadmap</span>
          </motion.h2>
          
          <motion.div
            variants={itemVariants}
            className="rounded-2xl overflow-hidden glass-card border-2 border-border/50 shadow-xl card-premium"
          >
            <img 
              src={assetAllocationImage} 
              alt="Your Asset Allocation - showing portfolio distribution across equity, debt, and gold"
              className="w-full h-auto"
              data-testid="img-asset-allocation-preview"
            />
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="rounded-2xl overflow-hidden glass-card border-2 border-border/50 shadow-xl card-premium"
          >
            <img 
              src={recommendedInvestmentsImage} 
              alt="Recommended Investments - personalized mutual fund suggestions based on your profile"
              className="w-full h-auto"
              data-testid="img-recommended-investments-preview"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
