import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import HowItWorks from "@/pages/HowItWorks";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading skeleton while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/about-us" component={AboutUs} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Show authenticated routes
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
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
