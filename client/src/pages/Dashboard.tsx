import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, Download, RefreshCw, Star, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const allocationData = [
  { name: "Equity", value: 50, color: "hsl(var(--chart-1))" },
  { name: "Hybrid", value: 20, color: "hsl(var(--chart-2))" },
  { name: "Debt", value: 25, color: "hsl(var(--chart-3))" },
  { name: "Gold", value: 5, color: "hsl(var(--chart-4))" },
];

//todo: remove mock functionality
const mutualFunds = [
  {
    name: "Parag Parikh Flexi Cap Fund",
    category: "Equity Flexi Cap",
    returns_1y: 20.5,
    returns_3y: 15.9,
    returns_5y: 18.2,
    aum: 34000,
    expense_ratio: 0.9,
    exit_load: "1% if redeemed within 1 year",
    rating: 5,
    risk: "Moderate",
    source: "Moneycontrol",
  },
  {
    name: "ICICI Prudential Bluechip Fund",
    category: "Large Cap",
    returns_1y: 18.3,
    returns_3y: 14.2,
    returns_5y: 16.8,
    aum: 45000,
    expense_ratio: 1.05,
    exit_load: "1% if redeemed within 1 year",
    rating: 4,
    risk: "Moderate",
    source: "AMFI",
  },
  {
    name: "Axis Midcap Fund",
    category: "Mid Cap",
    returns_1y: 25.7,
    returns_3y: 18.5,
    returns_5y: 20.1,
    aum: 28000,
    expense_ratio: 0.85,
    exit_load: "1% if redeemed within 1 year",
    rating: 5,
    risk: "High",
    source: "Moneycontrol",
  },
];

//todo: remove mock functionality
const bonds = [
  {
    name: "Tata Capital Bond Series A",
    coupon: "8.5%",
    maturity: "2028",
    rating: "AAA",
    yield: "8.7%",
  },
  {
    name: "Bajaj Finance FD",
    coupon: "8.2%",
    maturity: "2027",
    rating: "AAA",
    yield: "8.4%",
  },
];

//todo: remove mock functionality
const goldETFs = [
  {
    name: "HDFC Gold ETF",
    returns_1y: 12.5,
    returns_3y: 10.8,
    expense_ratio: 0.5,
    aum: 1200,
  },
  {
    name: "Nippon India Gold ETF",
    returns_1y: 12.3,
    returns_3y: 10.5,
    expense_ratio: 0.55,
    aum: 980,
  },
];

//todo: remove mock functionality
const projectionData = [
  { year: 2025, corpus: 500000 },
  { year: 2030, corpus: 1250000 },
  { year: 2035, corpus: 2800000 },
  { year: 2040, corpus: 5200000 },
  { year: 2045, corpus: 8500000 },
  { year: 2050, corpus: 12000000 },
];

export default function Dashboard() {
  const [expandedFund, setExpandedFund] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hi, Rajesh! Here's your Retirement Roadmap
          </h1>
          <p className="text-muted-foreground">
            Your personalized investment plan to achieve your retirement goals
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button data-testid="button-recalculate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Plan
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export Report (PDF)
          </Button>
        </div>

        {/* Warning */}
        <div className="mb-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Calculation Precision Notice
            </p>
            <p className="text-amber-800 dark:text-amber-300">
              Our calculations are very precise, but we recommend maintaining <strong>10-15% higher savings</strong> than suggested to account for market volatility and unexpected life events. Your corpus has been increased by 12% to provide for unexpected expenses like wedding, education, and health emergencies.
            </p>
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Asset Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Corpus Growth Projection</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="corpus" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Projected corpus by 2050: <span className="font-bold text-foreground">₹1.2 Crore</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Includes 7% annual SIP step-up and 6% inflation adjustment
              </p>
            </div>
          </Card>
        </div>

        {/* SWP Calculator */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Systematic Withdrawal Plan (SWP)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expected Longevity</p>
              <p className="text-2xl font-bold">85 years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Withdrawal Amount</p>
              <p className="text-2xl font-bold text-chart-2">₹65,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Post-Inflation Monthly Spending</p>
              <p className="text-2xl font-bold text-chart-4">₹1,45,000</p>
              <p className="text-xs text-muted-foreground mt-1">(Adjusted for 6% inflation)</p>
            </div>
          </div>
        </Card>

        {/* Recommendations Tabs */}
        <Tabs defaultValue="mutual-funds" className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="mutual-funds" data-testid="tab-mutual-funds">Mutual Funds</TabsTrigger>
            <TabsTrigger value="bonds" data-testid="tab-bonds">Corporate Bonds</TabsTrigger>
            <TabsTrigger value="gold" data-testid="tab-gold">Gold ETFs</TabsTrigger>
          </TabsList>

          <TabsContent value="mutual-funds" className="space-y-4">
            {mutualFunds.map((fund, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="text-lg font-semibold mb-1">{fund.name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{fund.category}</Badge>
                        <Badge variant="outline">{fund.source}</Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(fund.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-chart-4 text-chart-4" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">1Y Return</p>
                        <p className="text-lg font-bold text-chart-2">{fund.returns_1y}%</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedFund(expandedFund === index ? null : index)}
                        data-testid={`button-expand-${index}`}
                      >
                        {expandedFund === index ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">3Y Return</p>
                      <p className="font-semibold">{fund.returns_3y}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">5Y Return</p>
                      <p className="font-semibold">{fund.returns_5y}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AUM</p>
                      <p className="font-semibold">₹{fund.aum} Cr</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p className="font-semibold">{fund.risk}</p>
                    </div>
                  </div>

                  {expandedFund === index && (
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Expense Ratio</p>
                          <p className="text-base font-semibold">{fund.expense_ratio}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Exit Load</p>
                          <p className="text-base font-semibold">{fund.exit_load}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-3">
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          <strong>Recommended for:</strong> Wealth creation over 5+ years with {fund.risk.toLowerCase()} risk tolerance
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bonds" className="space-y-4">
            {bonds.map((bond, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{bond.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Rating: {bond.rating}</Badge>
                      <Badge variant="outline">Maturity: {bond.maturity}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Yield</p>
                    <p className="text-2xl font-bold text-chart-2">{bond.yield}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Coupon Rate</p>
                    <p className="font-semibold">{bond.coupon}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="font-semibold">Wint Wealth</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gold" className="space-y-4">
            {goldETFs.map((etf, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{etf.name}</h3>
                    <Badge variant="secondary">Gold ETF</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">1Y Return</p>
                    <p className="text-2xl font-bold text-chart-4">{etf.returns_1y}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">3Y Return</p>
                    <p className="font-semibold">{etf.returns_3y}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expense Ratio</p>
                    <p className="font-semibold">{etf.expense_ratio}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AUM</p>
                    <p className="font-semibold">₹{etf.aum} Cr</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-12 bg-muted/50 border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This is educational guidance only and not regulated investment advice. 
            We are not a SEBI-registered advisor. Verify instrument availability & suitability before investing. 
            Data sourced from AMFI, Moneycontrol, and Wint Wealth.
          </p>
        </div>
      </main>
    </div>
  );
}
