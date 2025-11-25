import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, TrendingUp } from "lucide-react";
import { analytics, EVENTS } from "@/lib/mixpanel";
import type { RetirementPlan } from "@shared/schema";

export default function PreviousPlans() {
  const [, setLocation] = useLocation();

  const { data: plans = [], isLoading } = useQuery<RetirementPlan[]>({
    queryKey: ["/api/retirement-plans"],
  });

  useEffect(() => {
    analytics.track(EVENTS.PREVIOUS_PLANS_VIEWED, {
      planCount: plans.length,
    });
  }, [plans.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">Your Retirement Plans</h1>
          <p className="text-muted-foreground mb-8">Loading your plans...</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <TrendingUp className="h-16 w-16 text-muted-foreground/50" />
          </div>
          <h1 className="text-3xl font-bold">No Plans Yet</h1>
          <p className="text-muted-foreground max-w-md">
            You haven't created any retirement plans yet. Start by creating your first plan to see your personalized retirement roadmap.
          </p>
          <Button
            onClick={() => setLocation("/onboarding")}
            size="lg"
            data-testid="button-create-first-plan"
          >
            Create Your First Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Retirement Plans</h1>
          <p className="text-muted-foreground">
            View and manage all your retirement plans. Click on any plan to see detailed analysis and recommendations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const freedomScore = plan.freedomScore || 0;
            const createdDate = new Date(plan.createdAt!).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );
            const yearsToRetirement =
              plan.retirementAge && plan.currentAge
                ? plan.retirementAge - plan.currentAge
                : 0;

            return (
              <Card
                key={plan.id}
                className="p-6 hover-elevate cursor-pointer transition-all flex flex-col"
                onClick={() => setLocation(`/dashboard?planId=${plan.id}`)}
                data-testid={`card-plan-${plan.id}`}
              >
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold" data-testid={`text-plan-name-${plan.id}`}>
                      {plan.fullName || "Untitled Plan"}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {createdDate}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Freedom Score */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Freedom Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{freedomScore}</span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70"
                          style={{ width: `${freedomScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Age</p>
                        <p className="text-lg font-semibold">{plan.currentAge}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          Years to Retire
                        </p>
                        <p className="text-lg font-semibold">{yearsToRetirement}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/dashboard?planId=${plan.id}`);
                  }}
                  data-testid={`button-view-plan-${plan.id}`}
                >
                  View Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => setLocation("/onboarding")}
            size="lg"
            data-testid="button-create-new-plan"
          >
            Create a New Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
