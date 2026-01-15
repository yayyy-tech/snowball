import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Download, RefreshCw, AlertTriangle, Wallet, Calculator, Target, TrendingDown, Sparkles, Map } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { RetirementPlan, CalculatedPlan } from "@shared/schema";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";
import { AdviceBot } from "@/components/AdviceBot";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ExpensesManager } from "@/components/ExpensesManager";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { analytics, EVENTS } from "@/lib/mixpanel";

export default function Dashboard() {
  const { toast } = useToast();
  
  // Get planId from query parameters
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('planId') || '';

  // Fetch retirement plan data
  const { data: plan, isLoading, error } = useQuery<RetirementPlan>({
    queryKey: [`/api/retirement-plans/${planId}`],
    enabled: !!planId,
  });
  
  // Track plan view
  useEffect(() => {
    if (plan) {
      analytics.track(EVENTS.PLAN_VIEWED, {
        planId: plan.id,
        freedomScore: plan.freedomScore,
        currentAge: plan.currentAge,
        retirementAge: plan.retirementAge,
      });
    }
  }, [plan?.id]);

  // Show substantial assets notification once when data loads
  useEffect(() => {
    if (plan?.calculatedPlan) {
      const calc = plan.calculatedPlan as CalculatedPlan;
      if (calc?.hasSubstantialAssets) {
        toast({
          title: "Excellent Financial Position!",
          description: `Your existing assets cover ${calc.assetCoveragePercentage}% of your retirement corpus. The recommended SIP will build an even stronger cushion for your golden years.`,
          duration: 8000,
        });
      }
    }
    // Trigger when hasSubstantialAssets flag changes, not just on plan ID change
  }, [(plan?.calculatedPlan as CalculatedPlan | undefined)?.hasSubstantialAssets, (plan?.calculatedPlan as CalculatedPlan | undefined)?.assetCoveragePercentage, toast]);

  if (!planId) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Plan Found</h1>
            <p className="text-muted-foreground">Please complete the onboarding questionnaire first.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/onboarding'}>
              Start Onboarding
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading your retirement plan...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Plan</h1>
            <p className="text-muted-foreground">There was an error loading your retirement plan.</p>
          </div>
        </main>
      </div>
    );
  }

  const calc = plan.calculatedPlan as CalculatedPlan;
  
  // Guard: Ensure calculated plan exists before rendering
  if (!calc) {
    return (
      <div className="min-h-screen gradient-mesh">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Calculating your plan...</h1>
            <p className="text-muted-foreground">Please wait while we generate your retirement roadmap.</p>
          </div>
        </main>
      </div>
    );
  }
  
  const userName = plan.fullName || "User";
  
  // Create summary cards from real data
  const summaryCards = [
    { 
      icon: Target, 
      label: "Years to Retirement", 
      value: calc.yearsToRetirement.toString(), 
      suffix: "years left" 
    },
    { 
      icon: Wallet, 
      label: "Retirement Corpus Needed", 
      value: `₹${(calc.totalCorpusNeeded / 10000000).toFixed(2)}Cr`, 
      suffix: "with 12% buffer" 
    },
    { 
      icon: TrendingUp, 
      label: "Monthly SIP Required", 
      value: `₹${(calc.sipAmount / 1000).toFixed(0)}K`, 
      suffix: "with 7% step-up" 
    },
  ];

  // Create allocation data from real calculations
  const allocationData = [
    { name: "Equity", value: calc.assetAllocation.equity, color: "hsl(var(--chart-1))" },
    { name: "Debt", value: calc.assetAllocation.debt, color: "hsl(var(--chart-2))" },
    { name: "Gold", value: calc.assetAllocation.gold, color: "hsl(var(--chart-4))" },
  ];
  
  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-headline mb-3">
            Hi, {userName}!
          </h1>
          <p className="text-subheadline">
            Here's your personalized retirement roadmap
          </p>
        </div>

        {/* Freedom Score Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Your Freedom Score</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  A measure of your progress towards financial independence
                </p>
                <div className="flex items-baseline gap-3 justify-center md:justify-start">
                  <span className="text-7xl font-bold text-primary" data-testid="text-freedom-score">
                    <AnimatedCounter value={calc.freedomScore || 0} decimals={0} />
                  </span>
                  <span className="text-4xl font-bold text-muted-foreground">/100</span>
                </div>
                <div className="mt-4">
                  {calc.freedomScore >= 80 ? (
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100">
                      Excellent - On track for freedom!
                    </Badge>
                  ) : calc.freedomScore >= 60 ? (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100">
                      Good - Small tweaks will help
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100">
                      Needs attention - But achievable!
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-80">
                {/* Progress Ring Visualization */}
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted/30"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(calc.freedomScore / 100) * 502.4} 502.4`}
                      className={`${
                        calc.freedomScore >= 80 ? 'text-green-500' :
                        calc.freedomScore >= 60 ? 'text-primary' :
                        'text-amber-500'
                      } transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Score</div>
                      <div className="text-3xl font-bold">{calc.freedomScore}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Advice Bot - Contextual Nudges */}
        {calc.adviceTriggers && calc.adviceTriggers.length > 0 && (
          <div className="mb-8">
            <AdviceBot triggers={calc.adviceTriggers} freedomScore={calc.freedomScore} />
          </div>
        )}

        {/* Important Notice */}
        <div className="mb-10 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-5 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Important: This calculation is very precise
            </p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              We recommend maintaining <strong>10-15% higher savings</strong> than suggested for account for market volatility, unforeseen expenses, and changes in life circumstances. The corpus has been increased by <strong>12%</strong> to provide for unexpected expenses like weddings, education, health, etc.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {summaryCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="p-6 card-hover border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">{card.label}</p>
                    {index === 0 ? (
                      <p className="text-3xl font-bold text-foreground" data-testid="text-years-to-retirement">
                        <AnimatedCounter value={calc.yearsToRetirement || 0} decimals={0} />
                      </p>
                    ) : index === 1 ? (
                      <p className="text-3xl font-bold text-foreground" data-testid="text-corpus-needed">
                        ₹<AnimatedCounter 
                          value={(calc.totalCorpusNeeded || 0) / 10000000} 
                          decimals={2} 
                        />Cr
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-foreground" data-testid="text-sip-amount">
                        ₹<AnimatedCounter 
                          value={(calc.sipAmount || 0) / 1000} 
                          decimals={0} 
                        />K
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{card.suffix}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons Row */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button size="lg" data-testid="button-recalculate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Plan
          </Button>
          <Link href={`/retirement-roadmap?planId=${planId}`}>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary font-semibold"
              data-testid="button-view-roadmap"
            >
              <Map className="h-5 w-5 mr-2" />
              View Detailed Roadmap
            </Button>
          </Link>
        </div>

        {/* Detailed Calculation Breakdown */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Detailed Calculation Breakdown</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Accumulation Phase */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Accumulation Phase</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Age:</span>
                  <span className="font-semibold">{plan.currentAge} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Starting Monthly SIP:</span>
                  <span className="font-semibold">₹{calc.sipAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Step-up:</span>
                  <span className="font-semibold">7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Years to Retirement:</span>
                  <span className="font-semibold">{calc.yearsToRetirement} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Assets:</span>
                  <span className="font-semibold">₹{(calc.totalAssets / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projected Asset Value:</span>
                  <span className="font-semibold">₹{(calc.projectedAssetValue / 10000000).toFixed(2)}Cr</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Annual Tax:</span>
                  <span className="font-semibold text-destructive">₹{calc.annualTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Buffer for Unexpected (12%):</span>
                  <span className="font-semibold text-chart-2">₹{(calc.bufferAmount / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-xs">For weddings, education, health emergencies, etc.</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3 bg-primary/5 p-3 rounded-lg mt-3">
                  <span className="font-bold">Total Corpus Needed:</span>
                  <span className="font-bold text-primary text-lg">₹{(calc.totalCorpusNeeded / 10000000).toFixed(2)}Cr</span>
                </div>
              </div>
            </div>

            {/* Withdrawal Phase */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-chart-2">Withdrawal Phase</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retirement Age:</span>
                  <span className="font-semibold">{plan.retirementAge} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Post-Retirement Years:</span>
                  <span className="font-semibold">{calc.yearsInRetirement} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Longevity Age:</span>
                  <span className="font-semibold">85 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Monthly Expense:</span>
                  <span className="font-semibold">₹{(plan.postRetirementMonthlyExpense || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inflation Rate Used:</span>
                  <span className="font-semibold">6%</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <span className="font-semibold text-blue-900 dark:text-blue-200">Monthly Expense @ Retirement:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-200">₹{calc.monthlyExpenseAtRetirement.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Monthly SWP Withdrawal:</h4>
                <p className="text-3xl font-bold text-green-900 dark:text-green-200">₹{calc.swpMonthlyWithdrawal.toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-800 dark:text-green-300 mt-2">
                  You can safely withdraw this amount monthly, adjusted for 6% inflation annually
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Asset Allocation */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Your Asset Allocation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Based on your <strong>{plan.riskTolerance}</strong> risk profile and <strong>{calc.yearsToRetirement} years</strong> to retirement
              </p>
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-lg">{item.value}%</span>
                </div>
              ))}
              
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg">
                <p className="text-xs text-blue-900 dark:text-blue-200">
                  <strong>Why this allocation?</strong> This allocation balances growth potential over your {calc.yearsToRetirement}-year horizon with appropriate risk management through debt and gold diversification.
                </p>
              </div>
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="mt-6 h-8 flex rounded-lg overflow-hidden">
            {allocationData.map((item, index) => (
              <div
                key={index}
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
                className="flex items-center justify-center text-xs font-semibold text-white"
              >
                {item.value}%
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended SIP */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Recommended Monthly SIP
              </h2>
              <p className="text-muted-foreground mb-4">
                To achieve your retirement corpus of ₹{(calc.totalCorpusNeeded / 10000000).toFixed(2)}Cr
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">₹{calc.sipAmount.toLocaleString('en-IN')}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                With 7% annual step-up (increase SIP by 7% each year)
              </p>
            </div>
            <div className="text-right">
              <Badge className="mb-2">Starting Today</Badge>
              <p className="text-xs text-muted-foreground">{calc.yearsToRetirement} years to retirement</p>
            </div>
          </div>
        </Card>

        {/* Recommended Investments */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-chart-2" />
            <h2 className="text-2xl font-semibold">Recommended Investments</h2>
          </div>

          {calc.investmentRecommendations.map((category: any, catIndex: number) => (
            <div key={catIndex} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.instruments.map((fund: any, index: number) => (
                  <Card key={index} className="p-4 hover-elevate transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <Badge 
                        variant={fund.risk === "High" ? "destructive" : fund.risk === "Medium" ? "default" : "secondary"}
                      >
                        {fund.risk}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-sm">{fund.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{fund.type}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Allocation</p>
                        <p className="font-bold text-chart-2">{fund.allocation}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expected Returns</p>
                        <p className="font-bold">{fund.returns}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {fund.reason}
                    </p>
              </Card>
            ))}
          </div>
            </div>
          ))}
        </div>

        {/* Advanced Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ExpensesManager planId={planId} />
            <WhatIfSimulator planId={planId} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-muted/50 border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This is educational guidance only and not regulated investment advice. 
            We are not a SEBI-registered advisor. Verify instrument availability & suitability before investing. 
            Data sourced from AMFI, Moneycontrol, and Wint Wealth. Past performance does not guarantee future results.
          </p>
        </div>

        {/* Download Plan Button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={async () => {
              try {
                const response = await fetch(`/api/retirement-plans/${planId}/download-pdf`);
                if (!response.ok) throw new Error('Failed to download PDF');
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Snowball_Retirement_Plan_${userName.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast({
                  title: "Success!",
                  description: "✅ Your Snowball plan is ready to download!",
                  duration: 5000,
                });
              } catch (error) {
                console.error('Error downloading PDF:', error);
                toast({
                  title: "Error",
                  description: "Failed to download PDF. Please try again.",
                  variant: "destructive",
                  duration: 5000,
                });
              }
            }}
            size="lg"
            className="bg-emerald-600 text-white font-semibold shadow-md"
            data-testid="button-download-pdf"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Plan (PDF)
          </Button>
        </div>
      </main>

      {/* Floating Chatbot Widget */}
      <ChatbotWidget planId={planId} />
    </div>
  );
}
