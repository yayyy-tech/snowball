import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

interface AIExplanationCardProps {
  planId: string;
  section: string;
  title: string;
}

export function AIExplanationCard({ planId, section, title }: AIExplanationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const { mutate: fetchExplanation, isPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/retirement-plans/${planId}/explain`, { section });
      return response.json();
    },
    onSuccess: (data) => {
      setExplanation(data.explanation);
      setError(null);
    },
    onError: () => {
      setError("Unable to generate explanation. Please try again.");
      setExplanation(null);
    }
  });

  const handleToggle = () => {
    if (!isExpanded && !explanation) {
      fetchExplanation();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border border-primary/20"
        onClick={handleToggle}
        data-testid={`button-explain-${section}`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">{title}</span>
        </div>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mt-2 p-4 bg-gradient-to-br from-primary/5 to-background border-primary/20">
              {isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating explanation...</span>
                </div>
              ) : error ? (
                <div className="text-sm text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setError(null);
                      fetchExplanation();
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : explanation ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed">{explanation}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to get an AI-powered explanation tailored to your plan.
                </p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
