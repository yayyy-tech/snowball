import { useState } from "react";
import { Header } from "@/components/Header";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Plus, Trash2, Info, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const formatIndianNumber = (value: string): string => {
  if (!value) return "";
  const num = value.replace(/,/g, "");
  if (!/^\d+$/.test(num)) return value;
  
  const numStr = num;
  const len = numStr.length;
  
  if (len <= 3) return numStr;
  
  let result = numStr.slice(-3);
  let remaining = numStr.slice(0, -3);
  
  while (remaining.length > 0) {
    if (remaining.length <= 2) {
      result = remaining + "," + result;
      remaining = "";
    } else {
      result = remaining.slice(-2) + "," + result;
      remaining = remaining.slice(0, -2);
    }
  }
  
  return result;
};

const parseIndianNumber = (value: string): string => {
  return value.replace(/,/g, "");
};

const steps = ["Personal", "Income", "Assets", "Liabilities", "Goals", "Risk", "Tax"];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    maritalStatus: "",
    planningChildren: false,
    dependents: [] as { name: string; relationship: string; age: string }[],
    spouseName: "",
    spouseAge: "",
    spouseWorking: false,
    spouseIncome: "",
    occupation: "",
    annualIncome: "",
    monthlyExpenses: "",
    financialSupport: "",
    familyEducationExpenses: "",
    hasLoan: false,
    loans: [] as { type: string; amount: string; emi: string; tenure: string; startDate: string; interestRate: string }[],
    totalAssets: "",
    netAssets: "",
    realEstateValue: "",
    stocksValue: "",
    mutualFundsValue: "",
    ppfEpfNps: "",
    bankDeposits: "",
    goldAssets: "",
    creditCardDebt: "",
    retirementAge: "",
    expensesPlannedAge: "",
    expectedMonthlyExpense: "",
    expectedLifestyle: "",
    sipStepUp: "7",
    riskTolerance: "",
    preferredAssetMix: "",
    currentTaxSlab: "",
    preferredTaxRegime: "",
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/retirement-plans", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your retirement plan has been created.",
      });
      setLocation(`/dashboard?planId=${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create retirement plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const planData = {
        fullName: formData.fullName,
        currentAge: parseInt(formData.age) || 0,
        retirementAge: parseInt(formData.retirementAge) || 60,
        gender: formData.maritalStatus === 'married' ? 'male' : 'male',
        maritalStatus: formData.maritalStatus,
        dependents: formData.dependents.length,
        
        monthlyIncome: Math.round((parseInt(formData.annualIncome) || 0) / 12),
        employmentType: formData.occupation || 'salaried',
        spouseName: formData.spouseName || null,
        spouseAge: formData.spouseAge ? parseInt(formData.spouseAge) : null,
        spouseWorking: formData.spouseWorking,
        spouseIncome: formData.spouseIncome ? parseInt(formData.spouseIncome) : null,
        hasHomeLoan: formData.hasLoan && formData.loans.some(l => l.type === 'home'),
        homeLoanEmi: formData.hasLoan ? parseInt(formData.loans.find(l => l.type === 'home')?.emi || '0') : 0,
        homeLoanTenure: formData.hasLoan ? parseInt(formData.loans.find(l => l.type === 'home')?.tenure || '0') : 0,
        
        realEstateValue: parseInt(formData.realEstateValue) || 0,
        stocksValue: parseInt(formData.stocksValue) || 0,
        mutualFundsValue: parseInt(formData.mutualFundsValue) || 0,
        ppfEpfNps: parseInt(formData.ppfEpfNps) || 0,
        bankDeposits: parseInt(formData.bankDeposits) || 0,
        goldAssets: parseInt(formData.goldAssets) || 0,
        
        retirementLifestyle: formData.expectedLifestyle || 'comfortable',
        postRetirementMonthlyExpense: parseInt(formData.expectedMonthlyExpense) || 0,
        legacyGoal: 0,
        majorExpenses: [],
        
        riskTolerance: formData.riskTolerance || 'moderate',
        investmentExperience: 'intermediate',
        preferredAssetMix: formData.preferredAssetMix || 'balanced-growth',
        
        taxRegime: formData.preferredTaxRegime || 'new',
        section80CInvestment: 0,
      };
      
      createPlanMutation.mutate(planData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addDependent = () => {
    setFormData({
      ...formData,
      dependents: [...formData.dependents, { name: "", relationship: "", age: "" }],
    });
  };

  const removeDependent = (index: number) => {
    setFormData({
      ...formData,
      dependents: formData.dependents.filter((_, i) => i !== index),
    });
  };

  const updateDependent = (index: number, field: string, value: string) => {
    const newDependents = [...formData.dependents];
    newDependents[index] = { ...newDependents[index], [field]: value };
    setFormData({ ...formData, dependents: newDependents });
  };

  const addLoan = () => {
    setFormData({
      ...formData,
      loans: [...formData.loans, { type: "", amount: "", emi: "", tenure: "", startDate: "", interestRate: "" }],
    });
  };

  const removeLoan = (index: number) => {
    setFormData({
      ...formData,
      loans: formData.loans.filter((_, i) => i !== index),
    });
  };

  const updateLoan = (index: number, field: string, value: string) => {
    const newLoans = [...formData.loans];
    newLoans[index] = { ...newLoans[index], [field]: value };
    setFormData({ ...formData, loans: newLoans });
  };

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">Your Progress</h2>
            <span className="text-sm font-semibold text-primary">{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium overflow-x-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`px-2 py-1 whitespace-nowrap ${
                  index + 1 === currentStep 
                    ? "text-primary" 
                    : index + 1 < currentStep 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-4xl mx-auto p-6 md:p-8">
          {/* Step 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Personal</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    data-testid="input-fullname"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                    data-testid="input-age"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maritalStatus">Marital Status *</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                  <SelectTrigger data-testid="select-marital-status">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="planningChildren"
                  checked={formData.planningChildren}
                  onCheckedChange={(checked) => setFormData({ ...formData, planningChildren: checked as boolean })}
                  data-testid="checkbox-planning-children"
                />
                <Label htmlFor="planningChildren" className="font-normal">I have or am planning to have children</Label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Dependents (e.g., parents, elderly relatives)</Label>
                  <Button variant="outline" size="sm" onClick={addDependent} data-testid="button-add-dependent">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Dependent
                  </Button>
                </div>
                
                {formData.dependents.map((dependent, index) => (
                  <div key={index} className="grid grid-cols-10 gap-3 mb-3">
                    <Input
                      placeholder="Name"
                      value={dependent.name}
                      onChange={(e) => updateDependent(index, "name", e.target.value)}
                      className="col-span-4"
                      data-testid={`input-dependent-name-${index}`}
                    />
                    <Input
                      placeholder="Relationship"
                      value={dependent.relationship}
                      onChange={(e) => updateDependent(index, "relationship", e.target.value)}
                      className="col-span-3"
                      data-testid={`input-dependent-relationship-${index}`}
                    />
                    <Input
                      type="number"
                      placeholder="Age"
                      value={dependent.age}
                      onChange={(e) => updateDependent(index, "age", e.target.value)}
                      className="col-span-2"
                      data-testid={`input-dependent-age-${index}`}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeDependent(index)} className="col-span-1" data-testid={`button-remove-dependent-${index}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              {formData.maritalStatus === "married" && (
                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">Spouse Details</Label>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="spouseName">Spouse Name</Label>
                      <Input
                        id="spouseName"
                        value={formData.spouseName}
                        onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                        placeholder="Enter spouse name"
                        data-testid="input-spouse-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="spouseAge">Spouse Age</Label>
                      <Input
                        id="spouseAge"
                        type="number"
                        value={formData.spouseAge}
                        onChange={(e) => setFormData({ ...formData, spouseAge: e.target.value })}
                        placeholder="Enter spouse age"
                        data-testid="input-spouse-age"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="spouseWorking"
                      checked={formData.spouseWorking}
                      onCheckedChange={(checked) => setFormData({ ...formData, spouseWorking: checked as boolean })}
                      data-testid="checkbox-spouse-working"
                    />
                    <Label htmlFor="spouseWorking" className="font-normal">Spouse is currently working</Label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Income */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Income</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div>
                <Label htmlFor="occupation">Occupation/Employer *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g., Software Engineer at TCS"
                  data-testid="input-occupation"
                />
              </div>

              <div>
                <Label htmlFor="annualIncome">Your Annual Income (₹) *</Label>
                <Input
                  id="annualIncome"
                  value={formatIndianNumber(formData.annualIncome)}
                  onChange={(e) => setFormData({ ...formData, annualIncome: parseIndianNumber(e.target.value) })}
                  placeholder="e.g., 12,00,000"
                  data-testid="input-annual-income"
                />
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Current Monthly Expenses (₹) *</Label>
                <Input
                  id="monthlyExpenses"
                  value={formatIndianNumber(formData.monthlyExpenses)}
                  onChange={(e) => setFormData({ ...formData, monthlyExpenses: parseIndianNumber(e.target.value) })}
                  placeholder="e.g., 50,000"
                  data-testid="input-monthly-expenses"
                />
              </div>

              {formData.maritalStatus === "married" && formData.spouseWorking && (
                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">Spouse Income</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="spouseIncome">Spouse Annual Income (₹)</Label>
                    <Input
                      id="spouseIncome"
                      value={formatIndianNumber(formData.spouseIncome)}
                      onChange={(e) => setFormData({ ...formData, spouseIncome: parseIndianNumber(e.target.value) })}
                      placeholder="e.g., 8,00,000"
                      data-testid="input-spouse-income"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Monthly Expenses</h3>
                
                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Household Expenses (₹) *</Label>
                  <Input
                    id="monthlyExpenses"
                    value={formatIndianNumber(formData.monthlyExpenses)}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 45,000"
                    data-testid="input-monthly-expenses"
                  />
                </div>

                <div>
                  <Label htmlFor="financialSupport">Financial Support to Relatives (₹/month)</Label>
                  <Input
                    id="financialSupport"
                    value={formatIndianNumber(formData.financialSupport)}
                    onChange={(e) => setFormData({ ...formData, financialSupport: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 10,000"
                    data-testid="input-financial-support"
                  />
                </div>

                <div>
                  <Label htmlFor="familyEducationExpenses">Family Education Expenses (₹/month)</Label>
                  <Input
                    id="familyEducationExpenses"
                    value={formatIndianNumber(formData.familyEducationExpenses)}
                    onChange={(e) => setFormData({ ...formData, familyEducationExpenses: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 15,000"
                    data-testid="input-education-expenses"
                  />
                </div>
              </div>

              {/* Monthly Savings Calculation */}
              <div className="grid md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-2xl border-2 border-primary/20 shadow-lg mt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
                  <div className="text-3xl font-bold text-primary" data-testid="text-monthly-income">
                    ₹<AnimatedCounter 
                      value={(() => {
                        const totalAnnualIncome = (parseInt(formData.annualIncome || '0') + parseInt(formData.spouseIncome || '0'));
                        return totalAnnualIncome / 12;
                      })()}
                      formatter={(value) => formatIndianNumber(value.toFixed(0))}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Total Monthly Expenses</p>
                  <div className="text-3xl font-bold text-destructive" data-testid="text-total-expenses">
                    ₹<AnimatedCounter 
                      value={(() => {
                        return (parseInt(formData.monthlyExpenses || '0') + 
                          parseInt(formData.financialSupport || '0') + 
                          parseInt(formData.familyEducationExpenses || '0'));
                      })()}
                      formatter={(value) => formatIndianNumber(value.toFixed(0))}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Savings</p>
                  <div className="text-3xl font-bold text-chart-2" data-testid="text-monthly-savings">
                    ₹<AnimatedCounter 
                      value={(() => {
                        const totalAnnualIncome = (parseInt(formData.annualIncome || '0') + parseInt(formData.spouseIncome || '0'));
                        const monthlyIncome = totalAnnualIncome / 12;
                        const totalExpenses = (parseInt(formData.monthlyExpenses || '0') + 
                          parseInt(formData.financialSupport || '0') + 
                          parseInt(formData.familyEducationExpenses || '0'));
                        return monthlyIncome - totalExpenses;
                      })()}
                      formatter={(value) => formatIndianNumber(value.toFixed(0))}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Step 3: Assets */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Assets</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{(() => {
                      const total = (parseInt(formData.realEstateValue || '0') +
                        parseInt(formData.stocksValue || '0') +
                        parseInt(formData.mutualFundsValue || '0') +
                        parseInt(formData.ppfEpfNps || '0') +
                        parseInt(formData.bankDeposits || '0') +
                        parseInt(formData.goldAssets || '0'));
                      return (total / 100000).toFixed(2);
                    })()}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Net Assets</p>
                  <p className="text-3xl font-bold text-chart-2">
                    ₹{(() => {
                      const total = (parseInt(formData.realEstateValue || '0') +
                        parseInt(formData.stocksValue || '0') +
                        parseInt(formData.mutualFundsValue || '0') +
                        parseInt(formData.ppfEpfNps || '0') +
                        parseInt(formData.bankDeposits || '0') +
                        parseInt(formData.goldAssets || '0'));
                      return (total / 100000).toFixed(2);
                    })()}L
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="realEstate">Real Estate Value (₹)</Label>
                  <Input
                    id="realEstate"
                    value={formatIndianNumber(formData.realEstateValue)}
                    onChange={(e) => setFormData({ ...formData, realEstateValue: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 50,00,000"
                    data-testid="input-real-estate"
                  />
                </div>

                <div>
                  <Label htmlFor="stocks">Stocks Value (₹)</Label>
                  <Input
                    id="stocks"
                    value={formatIndianNumber(formData.stocksValue)}
                    onChange={(e) => setFormData({ ...formData, stocksValue: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 5,00,000"
                    data-testid="input-stocks"
                  />
                </div>

                <div>
                  <Label htmlFor="mutualFunds">Mutual Funds Value (₹)</Label>
                  <Input
                    id="mutualFunds"
                    value={formatIndianNumber(formData.mutualFundsValue)}
                    onChange={(e) => setFormData({ ...formData, mutualFundsValue: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 3,00,000"
                    data-testid="input-mutual-funds"
                  />
                </div>

                <div>
                  <Label htmlFor="ppfEpfNps">PPF/EPF/NPS Balance (₹)</Label>
                  <Input
                    id="ppfEpfNps"
                    value={formatIndianNumber(formData.ppfEpfNps)}
                    onChange={(e) => setFormData({ ...formData, ppfEpfNps: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 2,00,000"
                    data-testid="input-ppf-epf"
                  />
                </div>

                <div>
                  <Label htmlFor="bankDeposits">Bank Deposits (₹)</Label>
                  <Input
                    id="bankDeposits"
                    value={formatIndianNumber(formData.bankDeposits)}
                    onChange={(e) => setFormData({ ...formData, bankDeposits: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 1,00,000"
                    data-testid="input-bank-deposits"
                  />
                </div>

                <div>
                  <Label htmlFor="goldAssets">Gold/Other Assets (₹)</Label>
                  <Input
                    id="goldAssets"
                    value={formatIndianNumber(formData.goldAssets)}
                    onChange={(e) => setFormData({ ...formData, goldAssets: parseIndianNumber(e.target.value) })}
                    placeholder="e.g., 50,000"
                    data-testid="input-gold-assets"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Liabilities */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Liabilities</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <Info className="inline h-4 w-4 mr-1" />
                  Add all your current loans and EMIs. We'll calculate when they'll end and adjust your savings plan accordingly.
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="hasLoan"
                  checked={formData.hasLoan}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasLoan: checked as boolean })}
                  data-testid="checkbox-has-loan"
                />
                <Label htmlFor="hasLoan" className="font-normal">I own my house (No rent payment needed post-retirement)</Label>
              </div>

              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-semibold">Your Loans</Label>
                <Button variant="outline" size="sm" onClick={addLoan} data-testid="button-add-loan">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Loan
                </Button>
              </div>

              {formData.loans.length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No loans added yet. Click "Add Loan" to include your liabilities.
                  </p>
                </Card>
              )}

              {formData.loans.map((loan, index) => (
                <Card key={index} className="p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-sm">Loan #{index + 1}</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeLoan(index)} data-testid={`button-remove-loan-${index}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={loan.type} onValueChange={(value) => updateLoan(index, "type", value)}>
                      <SelectTrigger data-testid={`select-loan-type-${index}`}>
                        <SelectValue placeholder="Loan Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="car">Car Loan</SelectItem>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="education">Education Loan</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Loan Amount (₹)"
                      value={formatIndianNumber(loan.amount)}
                      onChange={(e) => updateLoan(index, "amount", parseIndianNumber(e.target.value))}
                      data-testid={`input-loan-amount-${index}`}
                    />
                    <Input
                      placeholder="Monthly EMI (₹)"
                      value={formatIndianNumber(loan.emi)}
                      onChange={(e) => updateLoan(index, "emi", parseIndianNumber(e.target.value))}
                      data-testid={`input-loan-emi-${index}`}
                    />
                    <Input
                      type="number"
                      placeholder="Tenure (months)"
                      value={loan.tenure}
                      onChange={(e) => updateLoan(index, "tenure", e.target.value)}
                      data-testid={`input-loan-tenure-${index}`}
                    />
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={loan.startDate}
                      onChange={(e) => updateLoan(index, "startDate", e.target.value)}
                      data-testid={`input-loan-start-${index}`}
                    />
                    <Input
                      type="number"
                      placeholder="Interest Rate (%)"
                      value={loan.interestRate}
                      onChange={(e) => updateLoan(index, "interestRate", e.target.value)}
                      data-testid={`input-loan-rate-${index}`}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Step 5: Goals */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Goals</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="retirementAge">Desired Retirement Age *</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={formData.retirementAge}
                    onChange={(e) => setFormData({ ...formData, retirementAge: e.target.value })}
                    placeholder="e.g., 60"
                    data-testid="input-retirement-age"
                  />
                </div>

                <div>
                  <Label htmlFor="expensesAge">Expenses planned until age *</Label>
                  <Input
                    id="expensesAge"
                    type="number"
                    value={formData.expensesPlannedAge}
                    onChange={(e) => setFormData({ ...formData, expensesPlannedAge: e.target.value })}
                    placeholder="e.g., 85"
                    data-testid="input-expenses-age"
                  />
                  <div className="flex items-center gap-2 mt-2 text-sm text-chart-2">
                    <Heart className="h-4 w-4" />
                    <span>We hope you live the longest!</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="expectedExpense">Expected Monthly Expense After Retirement (₹) *</Label>
                <Input
                  id="expectedExpense"
                  value={formatIndianNumber(formData.expectedMonthlyExpense)}
                  onChange={(e) => setFormData({ ...formData, expectedMonthlyExpense: parseIndianNumber(e.target.value) })}
                  placeholder="e.g., 75,000"
                  data-testid="input-expected-expense"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Today's value, we'll adjust for 6% inflation automatically
                </p>
              </div>

              {formData.expectedMonthlyExpense && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <Info className="inline h-4 w-4 mr-1" />
                    After inflation (@ 6%): Your monthly expense at retirement will be approximately{" "}
                    <strong>₹{(parseInt(formData.expectedMonthlyExpense) * Math.pow(1.06, parseInt(formData.retirementAge || "60") - parseInt(formData.age || "30"))).toLocaleString('en-IN')}</strong>
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="lifestyle">Expected Lifestyle After Retirement *</Label>
                <Select value={formData.expectedLifestyle} onValueChange={(value) => setFormData({ ...formData, expectedLifestyle: value })}>
                  <SelectTrigger data-testid="select-lifestyle">
                    <SelectValue placeholder="Select lifestyle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxurious">Luxurious - Premium lifestyle with travel</SelectItem>
                    <SelectItem value="comfortable">Comfortable - Premium lifestyle with travel</SelectItem>
                    <SelectItem value="modest">Modest - Simple, peaceful living</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sipStepUp">Annual SIP Step-up Percentage (%) *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="sipStepUp"
                    type="number"
                    value={formData.sipStepUp}
                    onChange={(e) => setFormData({ ...formData, sipStepUp: e.target.value })}
                    placeholder="7"
                    className="max-w-xs"
                    data-testid="input-sip-stepup"
                  />
                  <Badge variant="secondary">Recommended: 7%</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <Info className="inline h-3 w-3 mr-1" />
                  Recommended: 7%. Increasing your SIP salary hikes helps build your corpus faster.
                </p>
              </div>

              {formData.retirementAge && formData.age && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-lg p-4">
                  <p className="text-sm text-green-900 dark:text-green-200">
                    <Info className="inline h-4 w-4 mr-1" />
                    Planning Horizon: You have <strong>{parseInt(formData.retirementAge) - parseInt(formData.age)} years</strong> until retirement. The earlier you start, the more your corpus can grow through compounding!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Risk */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Risk</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">What's your comfort level with market volatility? *</Label>
                <RadioGroup
                  value={formData.riskTolerance}
                  onValueChange={(value) => setFormData({ ...formData, riskTolerance: value })}
                  className="space-y-3"
                >
                  <Card className={`p-4 cursor-pointer transition-all ${formData.riskTolerance === 'conservative' ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="conservative" id="conservative" data-testid="radio-conservative" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="conservative" className="font-semibold cursor-pointer">Conservative</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          I prefer stable, low-risk investments. I'm okay with lower returns for peace of mind.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Typical Allocation: Equity 30-35%, Debt 50-60%, Gold 5-10%
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${formData.riskTolerance === 'moderate' ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="moderate" id="moderate" data-testid="radio-moderate" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="moderate" className="font-semibold cursor-pointer">Balanced</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          I can handle some market ups and downs for potentially better returns.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Typical Allocation: Equity 50-55%, Debt 35-40%, Gold 5-10%
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${formData.riskTolerance === 'aggressive' ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="aggressive" id="aggressive" data-testid="radio-aggressive" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="aggressive" className="font-semibold cursor-pointer">Aggressive</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          I'm comfortable with market volatility and want to maximize long-term growth.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Typical Allocation: Equity 70-80%, Debt 15-25%, Gold 5%
                        </p>
                      </div>
                    </div>
                  </Card>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Preferred Asset Mix *</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card 
                    className={`p-4 cursor-pointer transition-all text-center ${formData.preferredAssetMix === 'safety' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setFormData({ ...formData, preferredAssetMix: 'safety' })}
                    data-testid="card-safety"
                  >
                    <div className="mx-auto mb-3 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      {formData.preferredAssetMix === 'safety' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <Label htmlFor="safety" className="font-semibold cursor-pointer block">Safety First</Label>
                    <p className="text-xs text-muted-foreground mt-2">More debt and fixed deposits</p>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer transition-all text-center ${formData.preferredAssetMix === 'balanced-growth' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setFormData({ ...formData, preferredAssetMix: 'balanced-growth' })}
                    data-testid="card-balanced-growth"
                  >
                    <div className="mx-auto mb-3 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      {formData.preferredAssetMix === 'balanced-growth' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <Label htmlFor="balanced-growth" className="font-semibold cursor-pointer block">Balanced Growth</Label>
                    <p className="text-xs text-muted-foreground mt-2">Equal focus on growth and stability</p>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer transition-all text-center ${formData.preferredAssetMix === 'growth' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setFormData({ ...formData, preferredAssetMix: 'growth' })}
                    data-testid="card-growth"
                  >
                    <div className="mx-auto mb-3 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      {formData.preferredAssetMix === 'growth' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <Label htmlFor="growth" className="font-semibold cursor-pointer block">Growth Focused</Label>
                    <p className="text-xs text-muted-foreground mt-2">Higher equity for maximum returns</p>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Tax */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-1">Tax</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below. All fields marked with * are required.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxSlab">Current Tax Slab *</Label>
                  <Select value={formData.currentTaxSlab} onValueChange={(value) => setFormData({ ...formData, currentTaxSlab: value })}>
                    <SelectTrigger data-testid="select-tax-slab">
                      <SelectValue placeholder="Select tax slab" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-250000">₹0 - ₹2.5L (0%)</SelectItem>
                      <SelectItem value="250000-500000">₹2.5L - ₹5L (5%)</SelectItem>
                      <SelectItem value="500000-750000">₹5L - ₹7.5L (10%)</SelectItem>
                      <SelectItem value="750000-1000000">₹7.5L - ₹10L (15%)</SelectItem>
                      <SelectItem value="1000000-1250000">₹10L - ₹12.5L (20%)</SelectItem>
                      <SelectItem value="1250000-1500000">₹12.5L - ₹15L (25%)</SelectItem>
                      <SelectItem value="1500000+">₹15L+ (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="taxRegime">Preferred Tax Regime *</Label>
                  <Select value={formData.preferredTaxRegime} onValueChange={(value) => setFormData({ ...formData, preferredTaxRegime: value })}>
                    <SelectTrigger data-testid="select-tax-regime">
                      <SelectValue placeholder="Select tax regime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Regime (lower rates, no deductions)</SelectItem>
                      <SelectItem value="old">Old Regime (with 80C, HRA, etc.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <Info className="inline h-4 w-4 mr-1" />
                  <strong>Tax Tip:</strong> If you're in the old regime, maximize deductions under Section 80C (₹1.5L), 80D for health insurance, and NPS (₹50k) to reduce tax liability.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="button-back"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              data-testid="button-next"
              disabled={createPlanMutation.isPending}
            >
              {createPlanMutation.isPending ? "Creating Plan..." : currentStep === totalSteps ? "Complete & View Plan" : "Continue"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
