import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Download, RefreshCw, AlertTriangle, Wallet, Calculator, Target, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { RetirementPlan } from "@shared/schema";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";

export default function Dashboard() {
  
  // Get planId from query parameters
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('planId') || '';

  // Fetch retirement plan data
  const { data: plan, isLoading, error } = useQuery<RetirementPlan>({
    queryKey: [`/api/retirement-plans/${planId}`],
    enabled: !!planId,
  });

  if (!planId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
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

  const calc = plan.calculatedPlan;
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hi, {userName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's your personalized retirement roadmap
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Important: This calculation is very precise
            </p>
            <p className="text-amber-800 dark:text-amber-300">
              We recommend maintaining <strong>10-15% higher savings</strong> than suggested for account for market volatility, unforeseen expenses, and changes in life circumstances. The corpus has been increased by <strong>12%</strong> to provide for unexpected expenses like weddings, education, health, etc.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {summaryCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 shadow-lg border-2 card-hover bg-gradient-to-br from-background to-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">{card.label}</p>
                    {index === 0 ? (
                      <p className="text-4xl font-bold text-primary">
                        <AnimatedCounter value={calc.yearsToRetirement} decimals={0} />
                      </p>
                    ) : index === 1 ? (
                      <p className="text-4xl font-bold text-primary">
                        ₹<AnimatedCounter 
                          value={calc.totalCorpusNeeded / 10000000} 
                          decimals={2} 
                        />Cr
                      </p>
                    ) : (
                      <p className="text-4xl font-bold text-primary">
                        ₹<AnimatedCounter 
                          value={calc.sipAmount / 1000} 
                          decimals={0} 
                        />K
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{card.suffix}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ml-3">
                    <card.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recalculate Button */}
        <div className="mb-8">
          <Button size="lg" data-testid="button-recalculate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Plan
          </Button>
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
                  <span className="font-semibold">₹{plan.postRetirementMonthlyExpense.toLocaleString('en-IN')}</span>
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

        {/* Disclaimer */}
        <div className="mt-12 bg-muted/50 border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This is educational guidance only and not regulated investment advice. 
            We are not a SEBI-registered advisor. Verify instrument availability & suitability before investing. 
            Data sourced from AMFI, Moneycontrol, and Wint Wealth. Past performance does not guarantee future results.
          </p>
        </div>
      </main>
    </div>
  );
}
