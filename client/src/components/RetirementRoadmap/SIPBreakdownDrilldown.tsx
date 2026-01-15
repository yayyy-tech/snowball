import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, ChevronRight } from "lucide-react";
import { AIExplanationCard } from "./AIExplanationCard";
import { motion, AnimatePresence } from "framer-motion";

interface SIPBreakdownDrilldownProps {
  accumulationYears: Array<{ year: number; sipAmount: number; yearEndValue: number }>;
  initialSip: number;
  sipStepUp: number;
  planId: string;
}

export function SIPBreakdownDrilldown({
  accumulationYears,
  initialSip,
  sipStepUp,
  planId
}: SIPBreakdownDrilldownProps) {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getMonthlyBreakdown = (yearIndex: number, sipAmount: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulative = yearIndex > 0 
      ? accumulationYears.slice(0, yearIndex).reduce((sum, y) => sum + y.sipAmount * 12, 0)
      : 0;
    
    return months.map((month, i) => {
      cumulative += sipAmount;
      return {
        month,
        sip: sipAmount,
        cumulative
      };
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">SIP Breakdown</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="sip-view-toggle" className="text-sm text-muted-foreground">
            {viewMode === 'yearly' ? 'Yearly' : 'Monthly'}
          </Label>
          <Switch 
            id="sip-view-toggle"
            checked={viewMode === 'monthly'}
            onCheckedChange={(checked) => setViewMode(checked ? 'monthly' : 'yearly')}
            data-testid="switch-sip-view"
          />
        </div>
      </div>

      <div className="mb-4 p-4 bg-primary/10 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Starting SIP</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(initialSip)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Step-up</p>
            <p className="text-lg font-bold text-primary">{sipStepUp}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Final Year SIP</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(accumulationYears[accumulationYears.length - 1]?.sipAmount || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                {viewMode === 'monthly' ? '' : ''}Year/Age
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">
                Monthly SIP
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">
                Yearly Investment
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">
                Corpus at Year End
              </th>
            </tr>
          </thead>
          <tbody>
            {accumulationYears.map((yearData, index) => (
              <>
                <tr 
                  key={yearData.year}
                  className={`border-b hover:bg-muted/50 transition-colors ${viewMode === 'monthly' ? 'cursor-pointer' : ''}`}
                  onClick={() => viewMode === 'monthly' && toggleYear(yearData.year)}
                  data-testid={`row-year-${yearData.year}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {viewMode === 'monthly' && (
                        expandedYears.has(yearData.year) 
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">Age {yearData.year}</span>
                      <span className="text-xs text-muted-foreground">(Year {index + 1})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {formatCurrency(yearData.sipAmount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(yearData.sipAmount * 12)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-primary">
                    {formatCurrency(yearData.yearEndValue)}
                  </td>
                </tr>
                
                <AnimatePresence>
                  {viewMode === 'monthly' && expandedYears.has(yearData.year) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      key={`monthly-${yearData.year}`}
                    >
                      <td colSpan={4} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-muted-foreground">
                                <th className="py-2 text-left">Month</th>
                                <th className="py-2 text-right">SIP</th>
                                <th className="py-2 text-right">Cumulative</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getMonthlyBreakdown(index, yearData.sipAmount).map((m) => (
                                <tr key={m.month} className="border-b border-muted/50">
                                  <td className="py-2">{m.month}</td>
                                  <td className="py-2 text-right">{formatCurrency(m.sip)}</td>
                                  <td className="py-2 text-right">{formatCurrency(m.cumulative)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
      </div>

      <AIExplanationCard 
        planId={planId} 
        section="sip_growth" 
        title="Why does my SIP increase every year?"
      />
    </Card>
  );
}
