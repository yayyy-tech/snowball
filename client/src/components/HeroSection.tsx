import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Shield, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-strong" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 shadow-lg">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ users</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Because your golden years deserve a{" "}
                <span className="gradient-text">snowball effect</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Build your personalized retirement roadmap in minutes. Smart investment suggestions tailored for Indian investors.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="gradient-button text-lg px-8 py-6 text-white shadow-xl hover:shadow-2xl" data-testid="button-hero-start">
                  Start Planning
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass shadow-lg hover:shadow-xl transition-all" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4 justify-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-2" />
                <span className="text-sm font-medium">Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-3" />
                <span className="text-sm font-medium">Goal-Based Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-chart-4" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
