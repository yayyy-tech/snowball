import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface WhatIfSimulatorProps {
  planId: string;
}

export function WhatIfSimulator({ planId }: WhatIfSimulatorProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');

  const simulateMutation = useMutation({
    mutationFn: async (data: { question: string; planId: string }) => {
      const res = await apiRequest('POST', '/api/what-if', data);
      return res.json() as Promise<{ analysis: string; question: string }>;
    },
    onSuccess: (data: { analysis: string; question: string }) => {
      setAnalysis(data.analysis);
      setQuestion('');
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.details || error?.message || 'Unknown error occurred';
      toast({
        title: 'Error analyzing scenario',
        description: errorMsg,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    simulateMutation.mutate({ question, planId });
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">What If Simulator</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Login to explore scenarios with AI-powered analysis
        </p>
        <Button onClick={() => window.location.href = '/api/login'} data-testid="button-login-whatif">
          Login to Use Simulator
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">What If Simulator</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            placeholder="Ask a what-if question... e.g., 'What if I retire 5 years earlier?' or 'What if I increase my SIP by 50%?'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            data-testid="input-whatif-question"
          />
        </div>
        <Button type="submit" disabled={simulateMutation.isPending || !question.trim()} className="w-full" data-testid="button-submit-whatif">
          {simulateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Scenario'
          )}
        </Button>
      </form>

      {analysis && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg" data-testid="text-whatif-analysis">
          <h4 className="font-medium mb-2">AI Analysis:</h4>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}
    </Card>
  );
}
