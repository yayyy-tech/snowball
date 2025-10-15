import assetAllocationImage from "@assets/image_1760463234725.png";
import recommendedInvestmentsImage from "@assets/Screenshot 2025-10-14 230405_1760493135971.png";

export function PreviewSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="heading-sample-roadmap">
            Sample <span className="gradient-text">Roadmap</span>
          </h2>
          
          <div className="rounded-2xl overflow-hidden glass-card border-2 border-border shadow-2xl card-hover">
            <img 
              src={assetAllocationImage} 
              alt="Your Asset Allocation - showing portfolio distribution across equity, debt, and gold"
              className="w-full h-auto"
              data-testid="img-asset-allocation-preview"
            />
          </div>
          
          <div className="rounded-2xl overflow-hidden glass-card border-2 border-border shadow-2xl card-hover">
            <img 
              src={recommendedInvestmentsImage} 
              alt="Recommended Investments - personalized mutual fund suggestions based on your profile"
              className="w-full h-auto"
              data-testid="img-recommended-investments-preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
