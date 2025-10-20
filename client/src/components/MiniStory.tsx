import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MiniStoryProps {
  story: string;
  author: string;
  step: number;
}

// Mini-stories database inspired by Buffett, Damani, Munger, Housel
const MINI_STORIES = {
  1: [ // After Step 1: Life Snapshot
    {
      story: "Warren Buffett made 99% of his wealth after age 50. Time, not timing, builds wealth.",
      author: "Warren Buffett"
    },
    {
      story: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb"
    }
  ],
  2: [ // After Step 2: Money Flow
    {
      story: "If you keep saving ₹10,000 every month for 25 years, you'll reach ₹2.4 Cr — the same financial freedom Buffett bought himself at 32.",
      author: "Snowball Insight"
    },
    {
      story: "Discipline in saving beats heroics in investing. Build wealth through habits, not heroics.",
      author: "Radhakishan Damani"
    }
  ],
  3: [ // After Step 3: Assets & Liabilities
    {
      story: "Being debt-free is a bigger luxury than owning anything. Every EMI you close early adds a decade to your freedom.",
      author: "Radhakishan Damani"
    },
    {
      story: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
      author: "Albert Einstein"
    }
  ],
  4: [ // After Step 4: Dream Retirement
    {
      story: "Wealth is what you don't see. The most peaceful retirement isn't about yachts, it's about options.",
      author: "Morgan Housel"
    },
    {
      story: "Independence isn't about being rich. It's about having enough not to worry.",
      author: "Morgan Housel"
    }
  ],
  5: [ // After Step 5: Risk & Route
    {
      story: "The big money is not in the buying or selling, but in the waiting. Let Snowball do the waiting for you.",
      author: "Charlie Munger"
    },
    {
      story: "Volatility isn't risk; quitting is. Stay the course.",
      author: "Charlie Munger"
    }
  ]
};

export function MiniStory({ step }: { step: number }) {
  const stories = MINI_STORIES[step as keyof typeof MINI_STORIES] || [];
  
  // Randomize story selection
  const selectedStory = stories[Math.floor(Math.random() * stories.length)];
  
  if (!selectedStory) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-foreground mb-2 leading-relaxed">
              {selectedStory.story}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              — {selectedStory.author}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
