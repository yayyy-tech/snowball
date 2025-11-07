import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { OneTimeExpense } from '@shared/schema';

interface ExpensesManagerProps {
  planId?: string;
}

export function ExpensesManager({ planId }: ExpensesManagerProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [targetYear, setTargetYear] = useState('');

  const { data: expenses = [] } = useQuery<OneTimeExpense[]>({
    queryKey: ['/api/expenses'],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; estimatedCost: number; targetYear?: number; retirementPlanId?: string }) => {
      const res = await apiRequest('POST', '/api/expenses', data);
      return res.json() as Promise<OneTimeExpense>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      if (planId) {
        queryClient.invalidateQueries({ queryKey: [`/api/retirement-plans/${planId}`] });
      }
      toast({ title: 'Expense added successfully!' });
      setIsOpen(false);
      setName('');
      setEstimatedCost('');
      setTargetYear('');
    },
    onError: (error: any) => {
      toast({ title: 'Error adding expense', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/expenses/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      if (planId) {
        queryClient.invalidateQueries({ queryKey: [`/api/retirement-plans/${planId}`] });
      }
      toast({ title: 'Expense deleted' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !estimatedCost) return;

    createMutation.mutate({
      name,
      estimatedCost: parseInt(estimatedCost),
      targetYear: targetYear ? parseInt(targetYear) : undefined,
      retirementPlanId: planId || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">One-Time Expenses</h3>
        <p className="text-sm text-muted-foreground">Login to track big expenses like car, home, or wedding</p>
        <Button onClick={() => window.location.href = '/api/login'} className="mt-4" data-testid="button-login-expenses">
          Login to Add Expenses
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">One-Time Expenses</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-add-expense">
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add One-Time Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="e.g., Car purchase, Wedding"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  data-testid="input-expense-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Cost (₹)</label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  required
                  data-testid="input-expense-cost"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Target Year (Optional)</label>
                <Input
                  type="number"
                  placeholder="2030"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  data-testid="input-expense-year"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-expense">
                {createMutation.isPending ? 'Adding...' : 'Add Expense'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {expenses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No expenses added yet</p>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              data-testid={`expense-item-${expense.id}`}
            >
              <div className="flex-1">
                <p className="font-medium">{expense.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{expense.estimatedCost.toLocaleString('en-IN')}
                  {expense.targetYear && ` • Year: ${expense.targetYear}`}
                  {expense.inflationAdjustedCost && ` • Adjusted: ₹${(expense.inflationAdjustedCost / 100000).toFixed(2)}L`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(expense.id)}
                data-testid={`button-delete-expense-${expense.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
