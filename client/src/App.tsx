import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { initMixpanel } from "./lib/mixpanel";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import HowItWorks from "@/pages/HowItWorks";
import AboutUs from "@/pages/AboutUs";
import PreviousPlans from "@/pages/PreviousPlans";
import RetirementRoadmap from "@/pages/RetirementRoadmap";
import NotFound from "@/pages/not-found";

initMixpanel();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/previous-plans" component={PreviousPlans} />
      <Route path="/retirement-roadmap" component={RetirementRoadmap} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about-us" component={AboutUs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <ExitIntentModal />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
