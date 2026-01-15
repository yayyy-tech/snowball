import { Card } from "@/components/ui/card";
import { Calendar, Flag, Target, Milestone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineNarrativeProps {
  milestones: Array<{
    type: string;
    year: number;
    age: number;
    corpusValue: number;
    description: string;
  }>;
  currentAge: number;
  retirementAge: number;
  longevityAge: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
}

export function TimelineNarrative({
  milestones,
  currentAge,
  retirementAge,
  longevityAge,
  yearsToRetirement,
  yearsInRetirement
}: TimelineNarrativeProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case '25%':
      case '50%':
      case '75%':
      case '100%':
        return <Target className="h-5 w-5" />;
      case 'retirement':
        return <Sparkles className="h-5 w-5" />;
      case 'longevity':
        return <Flag className="h-5 w-5" />;
      default:
        return <Milestone className="h-5 w-5" />;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case '25%':
        return 'bg-blue-500';
      case '50%':
        return 'bg-amber-500';
      case '75%':
        return 'bg-green-500';
      case '100%':
        return 'bg-emerald-600';
      case 'retirement':
        return 'bg-primary';
      case 'longevity':
        return 'bg-purple-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const accumulationMilestones = milestones.filter(m => 
    ['25%', '50%', '75%', '100%', 'retirement'].includes(m.type)
  );
  
  const withdrawalMilestones = milestones.filter(m => 
    m.type === 'longevity'
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Your Financial Journey</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <h3 className="font-semibold text-lg">Accumulation Phase</h3>
            <span className="text-sm text-muted-foreground">
              ({yearsToRetirement} years)
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            From age {currentAge} to {retirementAge} - This is when you build your retirement corpus through disciplined SIP investments.
          </p>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-primary/30" />
            
            <div className="space-y-6">
              {accumulationMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10"
                  data-testid={`milestone-${milestone.type}`}
                >
                  <div className={`absolute left-2 w-5 h-5 rounded-full ${getMilestoneColor(milestone.type)} flex items-center justify-center text-white`}>
                    {getMilestoneIcon(milestone.type)}
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Age {milestone.age}</span>
                      <span className="text-sm text-muted-foreground">{milestone.year}</span>
                    </div>
                    <p className="text-sm mb-2">{milestone.description}</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(milestone.corpusValue)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <h3 className="font-semibold text-lg">Withdrawal Phase</h3>
            <span className="text-sm text-muted-foreground">
              ({yearsInRetirement} years)
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            From age {retirementAge} to {longevityAge} - This is when you enjoy your retirement, drawing from your corpus through SWP.
          </p>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-chart-2 to-chart-2/30" />
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative pl-10"
              >
                <div className="absolute left-2 w-5 h-5 rounded-full bg-chart-2 flex items-center justify-center text-white">
                  <Sparkles className="h-3 w-3" />
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900 dark:text-green-200">Retirement Begins</span>
                    <span className="text-sm text-green-700 dark:text-green-400">Age {retirementAge}</span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    You start withdrawing from your corpus to fund your lifestyle
                  </p>
                </div>
              </motion.div>

              {withdrawalMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="relative pl-10"
                  data-testid={`milestone-${milestone.type}`}
                >
                  <div className={`absolute left-2 w-5 h-5 rounded-full ${getMilestoneColor(milestone.type)} flex items-center justify-center text-white`}>
                    {getMilestoneIcon(milestone.type)}
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Age {milestone.age}</span>
                      <span className="text-sm text-muted-foreground">{milestone.year}</span>
                    </div>
                    <p className="text-sm mb-2">{milestone.description}</p>
                    {milestone.corpusValue > 0 && (
                      <p className="text-lg font-bold text-chart-2">
                        Legacy: {formatCurrency(milestone.corpusValue)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
