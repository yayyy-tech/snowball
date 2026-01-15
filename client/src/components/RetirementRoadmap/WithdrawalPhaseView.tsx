import { Card } from "@/components/ui/card";
import { Wallet, TrendingDown, Info } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { AIExplanationCard } from "./AIExplanationCard";

interface WithdrawalPhaseViewProps {
  withdrawalYears: Array<{ year: number; withdrawal: number; balance: number }>;
  swpMonthlyWithdrawal: number;
  retirementAge: number;
  longevityAge: number;
  planId: string;
}

export function WithdrawalPhaseView({
  withdrawalYears,
  swpMonthlyWithdrawal,
  retirementAge,
  longevityAge,
  planId
}: WithdrawalPhaseViewProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const chartData = withdrawalYears.map(y => ({
    age: `Age ${y.year}`,
    year: y.year,
    withdrawal: Math.round(y.withdrawal),
    balance: Math.round(y.balance / 100000),
    balanceRaw: y.balance
  }));

  const startingCorpus = withdrawalYears[0]?.balance || 0;
  const endingCorpus = withdrawalYears[withdrawalYears.length - 1]?.balance || 0;
  const totalWithdrawn = withdrawalYears.reduce((sum, y) => sum + y.withdrawal * 12, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-sm">
            Monthly Withdrawal: {formatCurrency(data.withdrawal)}
          </p>
          <p className="text-sm">
            Annual Withdrawal: {formatCurrency(data.withdrawal * 12)}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: 'hsl(var(--chart-2))' }}>
            Remaining Corpus: {formatCurrency(data.balanceRaw)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Post-Retirement Withdrawal Plan</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Starting SWP</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-400" data-testid="text-swp-amount">
            {formatCurrency(swpMonthlyWithdrawal)}
          </p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Starting Corpus</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(startingCorpus)}
          </p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
            {formatCurrency(totalWithdrawn)}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Legacy Fund</p>
          <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
            {formatCurrency(endingCorpus)}
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="age" 
              tick={{ fontSize: 12 }}
              interval={2}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value}L`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              name="Corpus Balance"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorBalance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Age</th>
              <th className="py-3 px-4 text-right font-medium text-muted-foreground">Monthly Withdrawal</th>
              <th className="py-3 px-4 text-right font-medium text-muted-foreground">Annual Withdrawal</th>
              <th className="py-3 px-4 text-right font-medium text-muted-foreground">Remaining Corpus</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalYears.map((y, index) => (
              <tr 
                key={y.year}
                className={`border-b hover:bg-muted/50 ${index === 0 ? 'bg-green-50/50 dark:bg-green-950/20' : ''}`}
                data-testid={`row-withdrawal-${y.year}`}
              >
                <td className="py-3 px-4 font-medium">
                  Age {y.year}
                  {index === 0 && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Retirement)</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">{formatCurrency(y.withdrawal)}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(y.withdrawal * 12)}</td>
                <td className="py-3 px-4 text-right font-bold text-chart-2">
                  {formatCurrency(y.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">About SWP Withdrawals</p>
            <p className="text-sm text-muted-foreground">
              Your withdrawal amount increases by 6% annually to account for inflation. 
              This ensures your purchasing power remains stable throughout retirement.
              {endingCorpus > 0 && ` The remaining ₹${(endingCorpus / 10000000).toFixed(2)}Cr becomes your legacy fund.`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Post-Retirement Return Assumptions</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              During retirement, your portfolio shifts to a more conservative debt-heavy allocation. 
              We assume a <strong>6.5% annual return</strong> (vs ~10-12% during accumulation) to protect your corpus 
              and ensure sustainable withdrawals throughout your retirement years.
            </p>
          </div>
        </div>
      </div>

      <AIExplanationCard 
        planId={planId} 
        section="withdrawal" 
        title="How is my withdrawal amount calculated?"
      />
    </Card>
  );
}
