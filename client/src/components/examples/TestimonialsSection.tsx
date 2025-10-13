import { TestimonialsSection } from "../TestimonialsSection";
import { ThemeProvider } from "../ThemeProvider";

export default function TestimonialsSectionExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <TestimonialsSection />
      </div>
    </ThemeProvider>
  );
}
