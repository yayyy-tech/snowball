import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Info, PieChart } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from "recharts";
import { AIExplanationCard } from "./AIExplanationCard";
import { CollapsibleBreakdown } from "./CollapsibleBreakdown";

interface CorpusGrowthChartProps {
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
  targetCorpus: number;
  planId: string;
  initialSip?: number;
  sipStepUp?: number;
}

export function CorpusGrowthChart({
  accumulationYears,
  withdrawalYears,
  monthlyProjections,
  targetCorpus,
  planId,
  initialSip = 0,
  sipStepUp = 7
}: CorpusGrowthChartProps) {
  const [viewMode, setViewMode] = useState<'yearly' | 'quarterly'>('yearly');

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const finalYearSip = accumulationYears[accumulationYears.length - 1]?.sipAmount || 0;
  
  const yearlyData = [
    ...accumulationYears.map((y, i) => {
      const totalInvested = accumulationYears.slice(0, i + 1).reduce((sum, yr) => sum + yr.sipAmount * 12, 0);
      return {
        label: `Age ${y.year}`,
        year: y.year,
        totalInvested: Math.round(totalInvested / 100000),
        corpusValue: Math.round(y.yearEndValue / 100000),
        phase: 'Accumulation'
      };
    }),
    ...withdrawalYears.map(y => ({
      label: `Age ${y.year}`,
      year: y.year,
      totalInvested: null,
      corpusValue: Math.round(y.balance / 100000),
      phase: 'Withdrawal'
    }))
  ];

  const quarterlyData = monthlyProjections
    .filter(m => m.month === 3 || m.month === 6 || m.month === 9 || m.month === 12)
    .map(m => ({
      label: `${m.year} Q${m.month === 3 ? 1 : m.month === 6 ? 2 : m.month === 9 ? 3 : 4}`,
      year: m.year,
      totalInvested: Math.round(m.totalInvested / 100000),
      corpusValue: Math.round(m.corpusValue / 100000),
      phase: m.phase === 'accumulation' ? 'Accumulation' : 'Withdrawal'
    }));

  const chartData = viewMode === 'yearly' ? yearlyData : quarterlyData;
  const retirementYear = accumulationYears[accumulationYears.length - 1]?.year;

  const formatValue = (value: number) => {
    if (value >= 100) {
      return `₹${(value / 100).toFixed(1)}Cr`;
    }
    return `₹${value.toFixed(0)}L`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)}
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Phase: {payload[0]?.payload?.phase}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Corpus Growth Over Time</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="view-toggle" className="text-sm text-muted-foreground">
            {viewMode === 'yearly' ? 'Yearly' : 'Quarterly'}
          </Label>
          <Switch 
            id="view-toggle"
            checked={viewMode === 'quarterly'}
            onCheckedChange={(checked) => setViewMode(checked ? 'quarterly' : 'yearly')}
            data-testid="switch-view-mode"
          />
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              interval={viewMode === 'yearly' ? 2 : 8}
            />
            <YAxis 
              tickFormatter={(value) => formatValue(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {retirementYear && (
              <ReferenceLine 
                x={`Age ${retirementYear}`} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                label={{ value: 'Retirement', fill: 'hsl(var(--destructive))', fontSize: 12 }}
              />
            )}
            <Area
              type="monotone"
              dataKey="totalInvested"
              name="Total Invested"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorInvested)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="corpusValue"
              name="Corpus Value"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorCorpus)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Understanding the Chart</p>
            <p className="text-sm text-muted-foreground">
              The gap between the two lines shows your compound growth - the "magic" of investing. 
              The wider the gap, the more your money is working for you.
            </p>
          </div>
        </div>
      </div>

      <AIExplanationCard 
        planId={planId} 
        section="compound_growth" 
        title="Why does the gap keep growing?"
      />

      <CollapsibleBreakdown
        title="View Detailed SIP Breakdown"
        icon={<PieChart className="h-5 w-5 text-blue-400" />}
        testId="dropdown-sip-breakdown"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-500/10 rounded-lg text-center border border-blue-500/20">
              <p className="text-sm text-gray-400 mb-1">Starting SIP</p>
              <p className="text-2xl font-bold text-blue-400" data-testid="text-starting-sip">
                {formatCurrency(initialSip || accumulationYears[0]?.sipAmount || 0)}
              </p>
              <p className="text-xs text-gray-500">/month</p>
            </div>
            <div className="p-4 bg-teal-500/10 rounded-lg text-center border border-teal-500/20">
              <p className="text-sm text-gray-400 mb-1">Annual Step-up</p>
              <p className="text-2xl font-bold text-teal-400" data-testid="text-step-up">
                {sipStepUp}%
              </p>
              <p className="text-xs text-gray-500">yearly increase</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg text-center border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">Final Year SIP</p>
              <p className="text-2xl font-bold text-purple-400" data-testid="text-final-sip">
                {formatCurrency(finalYearSip)}
              </p>
              <p className="text-xs text-gray-500">/month</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left font-medium text-gray-400">Year/Age</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Monthly SIP</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Yearly Investment</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Corpus at Year End</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {accumulationYears.map((yearData, index) => (
                  <tr 
                    key={yearData.year}
                    className="hover:bg-gray-750/50 transition-colors"
                    data-testid={`row-sip-${yearData.year}`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">Age {yearData.year}</span>
                      <span className="text-xs text-gray-500 ml-2">(Year {index + 1})</span>
                    </td>
                    <td className="py-3 px-4 text-right text-blue-400 font-medium">
                      {formatCurrency(yearData.sipAmount)}
                    </td>
                    <td className="py-3 px-4 text-right text-teal-400">
                      {formatCurrency(yearData.sipAmount * 12)}
                    </td>
                    <td className="py-3 px-4 text-right text-purple-400 font-bold">
                      {formatCurrency(yearData.yearEndValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong className="text-teal-400">7% Annual Step-up:</strong> Your SIP increases by 7% each year to 
              keep pace with your salary growth, accelerating wealth building through the power of compounding.
            </p>
          </div>
        </div>
      </CollapsibleBreakdown>
    </Card>
  );
}
