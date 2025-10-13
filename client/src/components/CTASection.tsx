import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calculator } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-grid-white/10" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <Calculator className="h-16 w-16 mx-auto text-primary-foreground/80" />
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
              Start Your Retirement Journey Today
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Get your personalized roadmap in minutes. No credit card required.
            </p>
            <div className="pt-4">
              <Link href="/onboarding">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8"
                  data-testid="button-cta-start"
                >
                  Start Planning Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
