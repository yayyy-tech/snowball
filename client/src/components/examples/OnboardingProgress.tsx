import { OnboardingProgress } from "../OnboardingProgress";
import { ThemeProvider } from "../ThemeProvider";

export default function OnboardingProgressExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <OnboardingProgress currentStep={3} totalSteps={6} />
      </div>
    </ThemeProvider>
  );
}
