import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ctaImage from "@assets/image_1760426945624.png";

export function CTASection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16">
          <div className="absolute inset-0 bg-grid-white/10" />
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src={ctaImage} 
                alt="Because your golden years deserve a snowball effect" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
