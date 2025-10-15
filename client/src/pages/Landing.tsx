import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PreviewSection } from "@/components/PreviewSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
