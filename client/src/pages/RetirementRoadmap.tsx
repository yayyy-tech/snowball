import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Map, TrendingUp, Calendar, PieChart, Wallet } from "lucide-react";
import { CorpusGrowthChart } from "@/components/RetirementRoadmap/CorpusGrowthChart";
import { SIPBreakdownDrilldown } from "@/components/RetirementRoadmap/SIPBreakdownDrilldown";
import { TimelineNarrative } from "@/components/RetirementRoadmap/TimelineNarrative";
import { AssetAllocationTimeline } from "@/components/RetirementRoadmap/AssetAllocationTimeline";
import { WithdrawalPhaseView } from "@/components/RetirementRoadmap/WithdrawalPhaseView";
import type { RetirementPlan } from "@shared/schema";

interface TimelineData {
  planId: string;
  currentAge: number;
  retirementAge: number;
  longevityAge: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  targetCorpus: number;
  initialSip: number;
  sipStepUp: number;
  assetAllocation: { equity: number; debt: number; gold: number };
  swpMonthlyWithdrawal: number;
  freedomScore: number;
  accumulationYears: Array<{ year: number; sipAmount: number; yearEndValue: number }>;
  withdrawalYears: Array<{ year: number; withdrawal: number; balance: number }>;
  monthlyProjections: Array<{
    month: number;
    year: number;
    age: number;
    sipAmount: number;
    totalInvested: number;
    corpusValue: number;
    phase: 'accumulation' | 'withdrawal';
  }>;
  milestones: Array<{
    type: string;
    year: number;
    age: number;
    corpusValue: number;
    description: string;
  }>;
}

export default function RetirementRoadmap() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('planId') || '';

  const { data: plan, isLoading: planLoading } = useQuery<RetirementPlan>({
    queryKey: [`/api/retirement-plans/${planId}`],
    enabled: !!planId,
  });

  const { data: timeline, isLoading: timelineLoading, error } = useQuery<TimelineData>({
    queryKey: [`/api/retirement-plans/${planId}/timeline`],
    enabled: !!planId,
  });

  if (!planId) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Plan Found</h1>
            <p className="text-muted-foreground mb-4">Please complete the onboarding first.</p>
            <Link href="/onboarding">
              <Button data-testid="button-start-onboarding">Start Onboarding</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (planLoading || timelineLoading) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-muted rounded mx-auto mb-4" />
              <div className="h-4 w-48 bg-muted rounded mx-auto" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !timeline || !plan) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Roadmap</h1>
            <p className="text-muted-foreground mb-4">Unable to load your retirement roadmap.</p>
            <Link href={`/dashboard?planId=${planId}`}>
              <Button variant="outline" data-testid="button-back-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link href={`/dashboard?planId=${planId}`}>
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Map className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Your Retirement Roadmap</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            A detailed timeline of your journey to financial freedom
          </p>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Age</p>
              <p className="text-2xl font-bold" data-testid="text-current-age">{timeline.currentAge}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Retirement Age</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-retirement-age">{timeline.retirementAge}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Longevity Age</p>
              <p className="text-2xl font-bold" data-testid="text-longevity-age">{timeline.longevityAge}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Freedom Score</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-freedom-score">{timeline.freedomScore}/100</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="growth" className="flex items-center gap-2" data-testid="tab-growth">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger value="sip" className="flex items-center gap-2" data-testid="tab-sip">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">SIP</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2" data-testid="tab-timeline">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="allocation" className="flex items-center gap-2" data-testid="tab-allocation">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Allocation</span>
            </TabsTrigger>
            <TabsTrigger value="withdrawal" className="flex items-center gap-2" data-testid="tab-withdrawal">
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="hidden sm:inline">Withdrawal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <CorpusGrowthChart 
              accumulationYears={timeline.accumulationYears}
              withdrawalYears={timeline.withdrawalYears}
              monthlyProjections={timeline.monthlyProjections}
              targetCorpus={timeline.targetCorpus}
              planId={planId}
            />
          </TabsContent>

          <TabsContent value="sip" className="space-y-6">
            <SIPBreakdownDrilldown 
              accumulationYears={timeline.accumulationYears}
              initialSip={timeline.initialSip}
              sipStepUp={timeline.sipStepUp}
              planId={planId}
            />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineNarrative 
              milestones={timeline.milestones}
              currentAge={timeline.currentAge}
              retirementAge={timeline.retirementAge}
              longevityAge={timeline.longevityAge}
              yearsToRetirement={timeline.yearsToRetirement}
              yearsInRetirement={timeline.yearsInRetirement}
            />
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <AssetAllocationTimeline 
              assetAllocation={timeline.assetAllocation}
              yearsToRetirement={timeline.yearsToRetirement}
              planId={planId}
            />
          </TabsContent>

          <TabsContent value="withdrawal" className="space-y-6">
            <WithdrawalPhaseView 
              withdrawalYears={timeline.withdrawalYears}
              swpMonthlyWithdrawal={timeline.swpMonthlyWithdrawal}
              retirementAge={timeline.retirementAge}
              longevityAge={timeline.longevityAge}
              planId={planId}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
