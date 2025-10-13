import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Download, RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Wallet, Calculator, Target, TrendingDown } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const summaryCards = [
  { icon: Calculator, label: "Total Investment", value: "14", suffix: "" },
  { icon: Wallet, label: "Invested Amount", value: "₹6.50Cr", suffix: "of invested" },
  { icon: TrendingUp, label: "Current Value SIP", value: "₹87K", suffix: "+10% yearly" },
  { icon: Target, label: "Returns", value: "₹217K", suffix: "in 25 years" },
];

//todo: remove mock functionality
const allocationData = [
  { name: "Equity", value: 70, color: "hsl(var(--chart-1))" },
  { name: "Debt", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Gold", value: 5, color: "hsl(var(--chart-4))" },
];

//todo: remove mock functionality
const mutualFunds = [
  {
    name: "HDFC Equity Fund - Direct Growth",
    category: "Large Cap Equity",
    returns_1y: "18.5%",
    expense_ratio: "0.85%",
    reason: "Top-rated large cap fund with excellent risk-adjusted returns",
    badge: "moderate",
  },
  {
    name: "Axis Bluechip Fund - Direct Growth",
    category: "Large Cap Equity",
    returns_1y: "19.2%",
    expense_ratio: "0.72%",
    reason: "Consistent performer with moderate risk and excellent exit strategy",
    badge: "moderate",
  },
  {
    name: "Parag Parikh Flexi Cap - Direct Growth",
    category: "Flexi Cap Equity",
    returns_1y: "22.5%",
    expense_ratio: "0.92%",
    reason: "Unique international exposure with strong yearly performance",
    badge: "high",
  },
  {
    name: "Kotak Asset Emerging Bluechip Fund - Direct Growth",
    category: "Mid Cap Equity",
    returns_1y: "24.4%",
    expense_ratio: "0.95%",
    reason: "Best-in-class mid cap fund with consistent outperformance",
    badge: "high",
  },
  {
    name: "ICICI Prudential Balanced Advantage Fund - Direct Growth",
    category: "Hybrid Balanced",
    returns_1y: "12.8%",
    expense_ratio: "0.88%",
    reason: "Dynamic asset allocation for lower volatility for conservative investors",
    badge: "low",
  },
  {
    name: "HDFC Corporate Bond Fund - Direct Growth",
    category: "Corporate Debt",
    returns_1y: "7.2%",
    expense_ratio: "0.45%",
    reason: "High-quality debt portfolio with AAA-rated papers for stability",
    badge: "low",
  },
];

//todo: remove mock functionality
const bonds = [
  {
    name: "Tata Capital 9.5% NCDs - 2027",
    category: "Non-Convertible Debentures",
    couponRate: "9.5%",
    reason: "Attractive fixed returns backed by reputed NBFC",
    badge: "low",
  },
  {
    name: "Mahindra Finance 8.9% NCDs - 2026",
    category: "Non-Convertible Debentures",
    couponRate: "8.9%",
    reason: "Strong fundamentals with steady interest payouts",
    badge: "low",
  },
  {
    name: "HDFC Bank 8.2% Bonds - 2028",
    category: "Bank Bonds",
    couponRate: "8.2%",
    reason: "High credit bank bonds with higher safety",
    badge: "low",
  },
];

//todo: remove mock functionality
const goldETFs = [
  {
    name: "HDFC Gold ETF",
    category: "Gold Exchange Traded Fund",
    returns_1y: "15.2%",
    expense_ratio: "0.50%",
    reason: "Highly domestic gold prices with high liquidity",
    badge: "low",
  },
  {
    name: "Nippon India Gold ETF",
    category: "Gold Exchange Traded Fund",
    returns_1y: "15.5%",
    expense_ratio: "0.55%",
    reason: "Low-cost gold investment with physical backing",
    badge: "low",
  },
  {
    name: "SBI Gold ETF",
    category: "Gold Exchange Traded Fund",
    returns_1y: "15.1%",
    expense_ratio: "0.53%",
    reason: "Reliable domestic-backed ETF for 10-15% portfolio diversification",
    badge: "low",
  },
];

export default function Dashboard() {
  const [expandedFund, setExpandedFund] = useState<number | null>(null);

  const userName = "Rajesh Kumar";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hi, {userName}! 👋
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
              ⚠️ Important: This calculation is very precise
            </p>
            <p className="text-amber-800 dark:text-amber-300">
              We recommend maintaining <strong>10-15% higher savings</strong> than suggested for account for market volatility, unforeseen expenses, and changes in life circumstances. The corpus has been increased by <strong>12%</strong> to provide for unexpected expenses like weddings, education, health, etc.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="text-xl md:text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.suffix}</p>
            </Card>
          ))}
        </div>

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
                  <span className="text-muted-foreground">Starting Monthly SIP:</span>
                  <span className="font-semibold">₹87,333</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Step-up:</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Years to Retirement:</span>
                  <span className="font-semibold">14 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Corpus (Pre-Tax):</span>
                  <span className="font-semibold">₹6.35Cr</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Tax Impact:</span>
                  <span className="font-semibold text-destructive">-₹64,301</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">• Long Tax (15.6%):</span>
                  <span className="font-semibold text-xs">₹14,571</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">• STCG Tax (15%):</span>
                  <span className="font-semibold text-xs">₹11,648</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Corpus (Post-Tax):</span>
                  <span className="font-semibold">₹6.28Cr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Buffer for Unexpected (12%):</span>
                  <span className="font-semibold text-chart-2">+₹69,568</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-xs">For weddings, education, health emergencies, etc.</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3 bg-primary/5 p-3 rounded-lg mt-3">
                  <span className="font-bold">Final Retirement Corpus:</span>
                  <span className="font-bold text-primary text-lg">₹6.35Cr</span>
                </div>
              </div>
            </div>

            {/* Withdrawal Phase */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-chart-2">Withdrawal Phase</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Post-Retirement Years:</span>
                  <span className="font-semibold">65 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Longevity Age:</span>
                  <span className="font-semibold">95 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Monthly Expense:</span>
                  <span className="font-semibold">₹320,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inflation Rate Used:</span>
                  <span className="font-semibold">6%</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <span className="font-semibold text-blue-900 dark:text-blue-200">Monthly Expense @ Retirement:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-200">₹678,271</span>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-muted-foreground">Retirement Readiness Score:</span>
                  <Badge variant="destructive" className="font-bold">89%</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Monthly SWP (4% rule):</h4>
                <p className="text-3xl font-bold text-green-900 dark:text-green-200">₹2,16,733</p>
                <p className="text-xs text-green-800 dark:text-green-300 mt-2">
                  You can safely withdraw this amount monthly for 65 years
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
                Based on your <strong>Aggressive</strong> risk profile and <strong>14 years</strong> to retirement
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
                  <strong>Why this allocation?</strong> Higher equity exposure maximizes growth potential over your 14-year horizon, while debt and gold provide stability.
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
                To achieve your retirement corpus of ₹6.35Cr
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">₹87,333</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                With 10% annual step-up (increase SIP by 10% each year)
              </p>
            </div>
            <div className="text-right">
              <Badge className="mb-2">Starting Today</Badge>
              <p className="text-xs text-muted-foreground">14 years to retirement</p>
            </div>
          </div>
        </Card>

        {/* Recommended Mutual Funds */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-chart-2" />
              <h2 className="text-2xl font-semibold">Recommended Mutual Funds</h2>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">25%</Badge>
              <Badge variant="outline">5%</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mutualFunds.map((fund, index) => (
              <Card key={index} className="p-4 hover-elevate transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <Badge 
                    variant={fund.badge === "high" ? "destructive" : fund.badge === "moderate" ? "default" : "secondary"}
                  >
                    {fund.badge}
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-2 text-sm">{fund.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{fund.category}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">1Y Returns</p>
                    <p className="font-bold text-chart-2">{fund.returns_1y}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expense Ratio</p>
                    <p className="font-bold">{fund.expense_ratio}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary">💡</span>
                  {fund.reason}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setExpandedFund(expandedFund === index ? null : index)}
                  data-testid={`button-fund-details-${index}`}
                >
                  More Details
                  {expandedFund === index ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Corporate Bond Opportunities */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="h-6 w-6 text-chart-3" />
            <h2 className="text-2xl font-semibold">Corporate Bond Opportunities</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonds.map((bond, index) => (
              <Card key={index} className="p-4 hover-elevate transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-chart-3" />
                  </div>
                  <Badge variant="secondary">{bond.badge}</Badge>
                </div>
                
                <h3 className="font-semibold mb-2 text-sm">{bond.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{bond.category}</p>
                
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">Coupon Rate</p>
                  <p className="font-bold text-chart-3 text-lg">{bond.couponRate}</p>
                </div>

                <p className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary">💡</span>
                  {bond.reason}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Gold ETF Options */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-6 text-chart-4">🏆</div>
            <h2 className="text-2xl font-semibold">Gold ETF Options</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goldETFs.map((etf, index) => (
              <Card key={index} className="p-4 hover-elevate transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🏆</div>
                  </div>
                  <Badge variant="secondary">{etf.badge}</Badge>
                </div>
                
                <h3 className="font-semibold mb-2 text-sm">{etf.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{etf.category}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">1Y Returns</p>
                    <p className="font-bold text-chart-4">{etf.returns_1y}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expense Ratio</p>
                    <p className="font-bold">{etf.expense_ratio}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary">💡</span>
                  {etf.reason}
                </p>
              </Card>
            ))}
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
      </main>
    </div>
  );
}
