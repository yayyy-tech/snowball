import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ctaImage from "@assets/image_1760426945624.png";

export function CTASection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16">
          <div className="absolute inset-0 bg-grid-white/10" />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              No two lives are the same, then why the retirement plan?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              that's why we curate it personalized only for you
            </p>
            <Link href="/onboarding">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-6 h-auto"
                data-testid="button-start-planning"
              >
                Start Planning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
