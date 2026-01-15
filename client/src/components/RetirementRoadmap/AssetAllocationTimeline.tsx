import { Card } from "@/components/ui/card";
import { PieChart as PieChartIcon, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AIExplanationCard } from "./AIExplanationCard";

interface AssetAllocationTimelineProps {
  assetAllocation: { equity: number; debt: number; gold: number };
  yearsToRetirement: number;
  planId: string;
}

export function AssetAllocationTimeline({
  assetAllocation,
  yearsToRetirement,
  planId
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

  return (
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

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
              Current Allocation Strategy
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              This allocation is based on your {yearsToRetirement}-year investment horizon and risk profile. 
              As you approach retirement, the plan recommends gradually shifting to a more conservative allocation.
            </p>
          </div>
        </div>
      </div>

      <AIExplanationCard 
        planId={planId} 
        section="asset_allocation" 
        title="Why this specific allocation?"
      />
    </Card>
  );
}
