import assetAllocationImage from "@assets/image_1760463234725.png";
import recommendedInvestmentsImage from "@assets/Screenshot 2025-10-14 230405_1760493135971.png";

export function PreviewSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="heading-sample-roadmap">
            Sample Roadmap
          </h2>
          
          <div className="rounded-lg overflow-hidden border border-border shadow-lg">
            <img 
              src={assetAllocationImage} 
              alt="Your Asset Allocation - showing portfolio distribution across equity, debt, and gold"
              className="w-full h-auto"
              data-testid="img-asset-allocation-preview"
            />
          </div>
          
          <div className="rounded-lg overflow-hidden border border-border shadow-lg">
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
