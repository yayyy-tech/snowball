import { motion } from "framer-motion";
import { Lightbulb, AlertCircle, TrendingUp, Target, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdviceBotProps {
  triggers: string[];
  freedomScore?: number;
}

// Advice messages for each trigger
const ADVICE_MESSAGES: Record<string, {
  icon: typeof Lightbulb;
  title: string;
  message: string;
  actionable: string;
  badge: string;
}> = {
  low_freedom_score: {
    icon: Target,
    title: "You're closer than you think!",
    message: "You're 30% away from true financial independence. A small tweak to your savings can make a big difference.",
    actionable: "Want to see how a 10% savings increase can fix it?",
    badge: "Action Needed"
  },
  low_savings: {
    icon: TrendingUp,
    title: "Small steps, big impact",
    message: "You don't need to be rich to invest. You need to invest to be rich.",
    actionable: "Even ₹5,000/month grows to ₹50L in 20 years at 12% returns.",
    badge: "Buffett Wisdom"
  },
  high_debt: {
    icon: AlertCircle,
    title: "Debt eats compounding silently",
    message: "Your EMI is taking a large chunk of your income. Every rupee in EMI today costs you ₹10 in retirement wealth.",
    actionable: "Consider closing high-interest loans first to free up savings.",
    badge: "Damani Insight"
  },
  early_retirement: {
    icon: Heart,
    title: "Freedom is earned, not early",
    message: "Early retirement is possible, but it needs compounding discipline and aggressive savings.",
    actionable: "You'll need to save 35-40% of income for early freedom.",
    badge: "Reality Check"
  },
  risk_goal_mismatch: {
    icon: Lightbulb,
    title: "Dreams need matching courage",
    message: "You dream big but invest safely. There's nothing wrong with that, but luxury retirement needs some growth exposure.",
    actionable: "Consider a balanced portfolio: 50% equity, 40% debt, 10% gold.",
    badge: "Strategy Tip"
  },
  panic_investor: {
    icon: Heart,
    title: "Volatility isn't risk, quitting is",
    message: "Market drops are normal. Panic selling is what destroys wealth. Your biggest edge is time.",
    actionable: "A diversified portfolio smooths the ride. Let's build one for you.",
    badge: "Munger Quote"
  }
};

export function AdviceBot({ triggers, freedomScore }: AdviceBotProps) {
  if (!triggers || triggers.length === 0) {
    // No advice needed - show encouraging message
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">You're on the right track!</h4>
                {freedomScore && freedomScore >= 70 && (
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100">
                    Freedom Score: {freedomScore}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your financial plan looks solid. Keep up the disciplined savings and let compounding do its magic.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  // Show the first triggered advice (most important)
  const primaryTrigger = triggers[0];
  const advice = ADVICE_MESSAGES[primaryTrigger];
  
  if (!advice) return null;
  
  const Icon = advice.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">{advice.title}</h4>
              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100">
                {advice.badge}
              </Badge>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
              {advice.message}
            </p>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              💡 {advice.actionable}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
