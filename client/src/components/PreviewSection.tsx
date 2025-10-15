import assetAllocationImage from "@assets/image_1760463234725.png";
import recommendedInvestmentsImage from "@assets/Screenshot 2025-10-14 230405_1760493135971.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

export function PreviewSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-8"
            data-testid="heading-sample-roadmap"
          >
            Sample <span className="gradient-text">Roadmap</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden glass-card border-2 border-border shadow-2xl card-hover"
          >
            <img 
              src={assetAllocationImage} 
              alt="Your Asset Allocation - showing portfolio distribution across equity, debt, and gold"
              className="w-full h-auto"
              data-testid="img-asset-allocation-preview"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl overflow-hidden glass-card border-2 border-border shadow-2xl card-hover"
          >
            <img 
              src={recommendedInvestmentsImage} 
              alt="Recommended Investments - personalized mutual fund suggestions based on your profile"
              className="w-full h-auto"
              data-testid="img-recommended-investments-preview"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
