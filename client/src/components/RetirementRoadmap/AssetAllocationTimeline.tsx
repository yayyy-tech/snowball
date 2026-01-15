import { Card } from "@/components/ui/card";
import { PieChart as PieChartIcon, Info, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AIExplanationCard } from "./AIExplanationCard";

interface RecommendedFund {
  name: string;
  category: string;
  allocationPercent: number;
  projectedInvestment: number;
  projectedValue: number;
}

interface AssetAllocationTimelineProps {
  assetAllocation: { equity: number; debt: number; gold: number };
  yearsToRetirement: number;
  planId: string;
  recommendedFunds?: RecommendedFund[];
  targetCorpus?: number;
}

export function AssetAllocationTimeline({
  assetAllocation,
  yearsToRetirement,
  planId,
  recommendedFunds = [],
  targetCorpus = 0
}: AssetAllocationTimelineProps) {
  const allocationData = [
    { name: "Equity", value: assetAllocation.equity, color: "hsl(var(--chart-1))" },
    { name: "Debt", value: assetAllocation.debt, color: "hsl(var(--chart-2))" },
    { name: "Gold", value: assetAllocation.gold, color: "hsl(var(--chart-4))" },
  ];

  const allocationDetails = [
    {
      type: "Equity",
      percentage: assetAllocation.equity,
      color: "hsl(var(--chart-1))",
      description: "Higher returns, higher volatility. Suitable for long-term wealth creation.",
      expectedReturn: "~12% p.a.",
      risk: "High"
    },
    {
      type: "Debt",
      percentage: assetAllocation.debt,
      color: "hsl(var(--chart-2))",
      description: "Stable returns, capital preservation. Provides cushion during market downturns.",
      expectedReturn: "~7% p.a.",
      risk: "Low"
    },
    {
      type: "Gold",
      percentage: assetAllocation.gold,
      color: "hsl(var(--chart-4))",
      description: "Inflation hedge, portfolio diversification. Acts as insurance during uncertainty.",
      expectedReturn: "~8% p.a.",
      risk: "Medium"
    }
  ];

  const blendedReturn = (
    (assetAllocation.equity * 12 + assetAllocation.debt * 7 + assetAllocation.gold * 8) / 100
  ).toFixed(1);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'equity':
        return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      case 'debt':
        return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
      case 'gold':
        return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Asset Allocation Strategy</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Expected Blended Return</p>
              <p className="text-2xl font-bold text-primary">{blendedReturn}% p.a.</p>
            </div>
          </div>

          <div className="space-y-4">
            {allocationDetails.map((item) => (
              <div 
                key={item.type}
                className="p-4 bg-muted/50 rounded-lg border-l-4"
                style={{ borderLeftColor: item.color }}
                data-testid={`allocation-${item.type.toLowerCase()}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{item.type}</span>
                  <span className="text-xl font-bold" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex gap-4 text-xs">
                  <span>Expected: {item.expectedReturn}</span>
                  <span>Risk: {item.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Accumulation Phase ({yearsToRetirement} years)
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  This allocation is optimized for your {yearsToRetirement}-year investment horizon and risk profile, 
                  targeting a blended return of ~{blendedReturn}% p.a. through diversification across asset classes.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 rotate-180" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                  Post-Retirement Shift
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  After retirement, your portfolio gradually shifts to a conservative debt-heavy allocation 
                  (~70% debt, 20% equity, 10% gold) with expected returns of <strong>6.5% p.a.</strong> to 
                  protect your corpus while generating stable income for withdrawals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AIExplanationCard 
          planId={planId} 
          section="asset_allocation" 
          title="Why this specific allocation?"
        />
      </Card>

      {recommendedFunds && recommendedFunds.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Recommended Funds</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Based on your asset allocation, here are specific mutual funds we recommend for your portfolio. 
            These projections show how much you'll invest in each fund and its expected value at retirement.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Fund Name</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Category</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Allocation</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Total Investment</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Projected Value</th>
                </tr>
              </thead>
              <tbody>
                {recommendedFunds.map((fund, index) => (
                  <tr 
                    key={index} 
                    className="border-b hover:bg-muted/50 transition-colors"
                    data-testid={`fund-row-${index}`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium">{fund.name}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(fund.category)}`}>
                        {fund.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {fund.allocationPercent}%
                    </td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(fund.projectedInvestment)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-primary">
                      {formatCurrency(fund.projectedValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td className="py-3 px-4 font-semibold" colSpan={2}>Total</td>
                  <td className="py-3 px-4 text-right font-bold">100%</td>
                  <td className="py-3 px-4 text-right font-bold">
                    {formatCurrency(recommendedFunds.reduce((sum, f) => sum + f.projectedInvestment, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-primary">
                    {formatCurrency(recommendedFunds.reduce((sum, f) => sum + f.projectedValue, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Disclaimer:</strong> Fund recommendations are for educational purposes only. 
                  Past performance does not guarantee future results. Please consult with a SEBI-registered 
                  investment advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
