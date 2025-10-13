import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/stock_images/professional_couple__0071d618.jpg";
import { TrendingUp, Shield, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ users</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Because your golden years deserve a{" "}
                <span className="text-primary">snowball effect</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Build your personalized retirement roadmap in minutes. Smart investment suggestions tailored for Indian investors.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="text-lg px-8" data-testid="button-hero-start">
                  Start Planning
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
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

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Financial planning" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
