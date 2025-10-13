import { HowItWorksSection } from "../HowItWorksSection";
import { ThemeProvider } from "../ThemeProvider";

export default function HowItWorksSectionExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <HowItWorksSection />
      </div>
    </ThemeProvider>
  );
}
