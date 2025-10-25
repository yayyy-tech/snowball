import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useLocation } from "wouter";
import { Heart, TrendingUp, Building, Palmtree, Target, Sparkles, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MiniStory } from "@/components/MiniStory";
import { motion } from "framer-motion";

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

const steps = [
  { id: 1, title: "Life Snapshot", icon: Heart, color: "blue" },
  { id: 2, title: "Money Flow", icon: TrendingUp, color: "green" },
  { id: 3, title: "Assets & Obligations", icon: Building, color: "purple" },
  { id: 4, title: "Dream Retirement", icon: Palmtree, color: "orange" },
  { id: 5, title: "Risk & Route", icon: Target, color: "red" }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { toast } = useToast();

  // Form state - simplified for 5-step flow
  const [formData, setFormData] = useState({
    // Step 1: Life Snapshot
    fullName: "",
    age: "",
    retirementAge: "60",
    maritalStatus: "",
    dependents: "0",
    
    // Step 2: Money Flow
    monthlyIncome: "",
    monthlySavings: "", // direct amount instead of percentage
    monthlyExpenses: "", // direct amount instead of percentage
    
    // Step 3: Assets & Obligations
    totalAssets: "",
    loanEmi: "",
    loanYearsLeft: "",
    
    // Step 4: Dream Retirement
    lifestyleChoice: "", // modest, comfortable, luxury, nomadic
    retirementLocation: "", // current_city, tier2, village, abroad
    longevityYears: 25, // years in retirement (default: retire at 60, live till 85)
    
    // Step 5: Risk & Route
    portfolioDropReaction: "", // sleep_fine, worried, panic
    incomeVsGrowthPreference: 50, // 0 = income focused, 100 = growth focused
  });

  const [showMiniStory, setShowMiniStory] = useState(false);

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/retirement-plans", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Your freedom roadmap is ready!",
        description: "Calculating your path to financial independence...",
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
      setShowMiniStory(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowMiniStory(false);
      }, 4000); // Show mini-story for 4 seconds
    } else {
      // Calculate derived values
      const currentAge = parseInt(formData.age) || 25;
      const retirementAge = parseInt(formData.retirementAge) || 60;
      const monthlyIncome = parseInt(parseIndianNumber(formData.monthlyIncome)) || 0;
      const monthlySavings = parseInt(parseIndianNumber(formData.monthlySavings)) || 0;
      const monthlyExpenses = parseInt(parseIndianNumber(formData.monthlyExpenses)) || 0;
      const totalAssets = parseInt(parseIndianNumber(formData.totalAssets)) || 0;
      const loanEmi = parseInt(parseIndianNumber(formData.loanEmi)) || 0;
      const loanYearsLeft = parseInt(formData.loanYearsLeft) || 0;
      
      // Calculate percentages for backend
      const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;
      
      // Use the monthly expenses directly
      const inferredMonthlyExpense = monthlyExpenses;
      
      // Calculate essential expense ratio: assume 60% default if no expenses entered
      // This will be used by backend calculations
      const essentialExpenseRatio = 60; // Default - can be enhanced later
      const lifestyleExpenseRatio = 100 - essentialExpenseRatio;
      
      // Map lifestyle to replacement ratio (will be done on backend)
      const replacementRatio = 
        formData.lifestyleChoice === 'modest' ? 70 :
        formData.lifestyleChoice === 'comfortable' ? 90 :
        formData.lifestyleChoice === 'luxury' ? 120 :
        formData.lifestyleChoice === 'nomadic' ? 110 : 90;
      
      const planData = {
        fullName: formData.fullName,
        currentAge,
        retirementAge,
        gender: 'male', // Default
        maritalStatus: formData.maritalStatus,
        dependents: parseInt(formData.dependents) || 0,
        
        monthlyIncome,
        employmentType: 'salaried',
        spouseName: null,
        spouseAge: null,
        spouseWorking: false,
        spouseIncome: null,
        
        // New fields for 5-step flow
        savingsRate, // Calculated from monthlySavings / monthlyIncome
        essentialExpenseRatio, // Default 60% - for backend calculations
        lifestyleExpenseRatio,
        totalAssets,
        loanEmi,
        loanYearsLeft,
        lifestyleChoice: formData.lifestyleChoice,
        retirementLocation: formData.retirementLocation,
        longevityYears: formData.longevityYears,
        portfolioDropReaction: formData.portfolioDropReaction,
        incomeVsGrowthPreference: formData.incomeVsGrowthPreference,
        inferredMonthlyExpense,
        replacementRatio,
        
        // Legacy fields (will be calculated on backend)
        hasHomeLoan: loanEmi > 0,
        homeLoanEmi: loanEmi,
        homeLoanTenure: loanYearsLeft,
        realEstateValue: 0,
        stocksValue: 0,
        mutualFundsValue: 0,
        ppfEpfNps: 0,
        bankDeposits: 0,
        goldAssets: 0,
        retirementLifestyle: formData.lifestyleChoice || 'comfortable',
        postRetirementMonthlyExpense: Math.round(inferredMonthlyExpense * (replacementRatio / 100)),
        legacyGoal: 0,
        majorExpenses: [],
        riskTolerance: 
          formData.portfolioDropReaction === 'sleep_fine' ? 'aggressive' :
          formData.portfolioDropReaction === 'worried' ? 'moderate' : 'conservative',
        investmentExperience: 'intermediate',
        preferredAssetMix: 'balanced-growth',
        taxRegime: 'new',
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

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  
  // Calculate values for display
  const monthlyIncome = parseInt(parseIndianNumber(formData.monthlyIncome)) || 0;
  const monthlySavings = parseInt(parseIndianNumber(formData.monthlySavings)) || 0;
  const monthlyExpenses = parseInt(parseIndianNumber(formData.monthlyExpenses)) || 0;
  
  // Calculate derived savings rate for display
  const derivedSavingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;
  
  // Validation checks
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.age && formData.retirementAge && formData.maritalStatus;
      case 2: {
        // Check all fields are filled and are positive numbers
        const hasAllFields = formData.monthlyIncome && formData.monthlySavings && formData.monthlyExpenses;
        if (!hasAllFields) return false;
        
        // Parse values
        const income = parseInt(parseIndianNumber(formData.monthlyIncome)) || 0;
        const savings = parseInt(parseIndianNumber(formData.monthlySavings)) || 0;
        const expenses = parseInt(parseIndianNumber(formData.monthlyExpenses)) || 0;
        
        // Ensure all are positive numbers
        if (income <= 0 || savings < 0 || expenses < 0) return false;
        
        // Block if savings + expenses exceeds income
        if (savings + expenses > income) return false;
        
        return true;
      }
      case 3:
        return true; // Optional fields
      case 4:
        return formData.lifestyleChoice && formData.retirementLocation;
      case 5:
        return formData.portfolioDropReaction;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress with Step Icons */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Your Journey to Freedom</h2>
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              {progressPercentage}% Complete
            </Badge>
          </div>
          
          {/* Visual step progress */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index + 1 < currentStep;
                const isCurrent = index + 1 === currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs font-medium text-center hidden md:block ${
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mini Story between steps */}
        {showMiniStory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MiniStory step={currentStep} />
          </motion.div>
        ) : (
          <Card className="p-6 md:p-8">
            {/* Step 1: Life Snapshot */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Let's start with you</h2>
                  <p className="text-muted-foreground">Tell us about your current life situation</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="text-base">What's your name?</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="mt-2 h-12 text-lg"
                      data-testid="input-fullname"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="age" className="text-base">How old are you?</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Your age"
                        className="mt-2 h-12 text-lg"
                        data-testid="input-age"
                      />
                    </div>

                    <div>
                      <Label htmlFor="retirementAge" className="text-base">When do you want to retire?</Label>
                      <Input
                        id="retirementAge"
                        type="number"
                        value={formData.retirementAge}
                        onChange={(e) => setFormData({ ...formData, retirementAge: e.target.value })}
                        placeholder="Retirement age"
                        className="mt-2 h-12 text-lg"
                        data-testid="input-retirement-age"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">Marital status</Label>
                    <RadioGroup 
                      value={formData.maritalStatus} 
                      onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="single" id="single" className="peer sr-only" />
                        <Label
                          htmlFor="single"
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-single"
                        >
                          Single
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="married" id="married" className="peer sr-only" />
                        <Label
                          htmlFor="married"
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-married"
                        >
                          Married
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="dependents" className="text-base">How many dependents? (kids, parents, etc.)</Label>
                    <Select 
                      value={formData.dependents} 
                      onValueChange={(value) => setFormData({ ...formData, dependents: value })}
                    >
                      <SelectTrigger className="mt-2 h-12 text-lg" data-testid="select-dependents">
                        <SelectValue placeholder="Select number of dependents" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Money Flow */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Your money flow</h2>
                  <p className="text-muted-foreground">Help us understand your income and savings</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="monthlyIncome" className="text-base">What's your monthly income? (take-home)</Label>
                    <Input
                      id="monthlyIncome"
                      value={formatIndianNumber(formData.monthlyIncome)}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: parseIndianNumber(e.target.value) })}
                      placeholder="e.g., 1,00,000"
                      className="mt-2 h-12 text-lg"
                      data-testid="input-monthly-income"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Enter your post-tax monthly income in ₹</p>
                  </div>

                  <div>
                    <Label htmlFor="monthlySavings" className="text-base">How much do you save each month?</Label>
                    <Input
                      id="monthlySavings"
                      type="text"
                      inputMode="numeric"
                      value={formatIndianNumber(formData.monthlySavings)}
                      onChange={(e) => {
                        const value = parseIndianNumber(e.target.value);
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({ ...formData, monthlySavings: value });
                        }
                      }}
                      placeholder="e.g., 20,000"
                      className="mt-2 h-12 text-lg"
                      data-testid="input-monthly-savings"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Enter the amount you typically save or invest each month
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="monthlyExpenses" className="text-base">What are your monthly expenses?</Label>
                    <Input
                      id="monthlyExpenses"
                      type="text"
                      inputMode="numeric"
                      value={formatIndianNumber(formData.monthlyExpenses)}
                      onChange={(e) => {
                        const value = parseIndianNumber(e.target.value);
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({ ...formData, monthlyExpenses: value });
                        }
                      }}
                      placeholder="e.g., 60,000"
                      className="mt-2 h-12 text-lg"
                      data-testid="input-monthly-expenses"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Include rent, groceries, utilities, EMIs, dining, travel, shopping, entertainment, etc.
                    </p>
                  </div>

                  {/* Live Calculation */}
                  {monthlyIncome > 0 && (monthlySavings > 0 || monthlyExpenses > 0) && (
                    <div className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-900">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-savings-rate">
                            {derivedSavingsRate}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">of your income</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Total Accounted</p>
                          <div className="text-2xl font-bold text-foreground" data-testid="text-total-accounted">
                            ₹<AnimatedCounter 
                              value={monthlySavings + monthlyExpenses}
                              formatter={(value) => formatIndianNumber(value.toFixed(0))}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {monthlySavings + monthlyExpenses > monthlyIncome ? (
                              <span className="text-destructive">⚠ Exceeds income!</span>
                            ) : monthlySavings + monthlyExpenses === monthlyIncome ? (
                              <span className="text-green-600 dark:text-green-400">✓ Balanced</span>
                            ) : (
                              <span>₹{formatIndianNumber((monthlyIncome - monthlySavings - monthlyExpenses).toString())} unaccounted</span>
                            )}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Income Breakdown</p>
                          <div className="text-sm font-medium">
                            <div className="flex justify-between mb-1">
                              <span>Savings:</span>
                              <span className="text-green-600 dark:text-green-400">{derivedSavingsRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expenses:</span>
                              <span>{monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Validation Error Message */}
                      {monthlySavings + monthlyExpenses > monthlyIncome && (
                        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg" data-testid="error-exceeds-income">
                          <p className="text-sm font-medium text-destructive">
                            Your savings and expenses together (₹{formatIndianNumber((monthlySavings + monthlyExpenses).toString())}) 
                            exceed your income (₹{formatIndianNumber(monthlyIncome.toString())}).
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Please adjust your numbers so that savings + expenses ≤ income.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Assets & Obligations */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">What you own & owe</h2>
                  <p className="text-muted-foreground">Your current financial position</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="totalAssets" className="text-base">Total value of all your assets</Label>
                    <Input
                      id="totalAssets"
                      value={formatIndianNumber(formData.totalAssets)}
                      onChange={(e) => setFormData({ ...formData, totalAssets: parseIndianNumber(e.target.value) })}
                      placeholder="e.g., 50,00,000"
                      className="mt-2 h-12 text-lg"
                      data-testid="input-total-assets"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Include: Property, stocks, mutual funds, PPF, NPS, FD, gold, PF balance, etc.
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Do you have any loans?</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="loanEmi" className="text-base">Total monthly EMI (all loans combined)</Label>
                        <Input
                          id="loanEmi"
                          value={formatIndianNumber(formData.loanEmi)}
                          onChange={(e) => setFormData({ ...formData, loanEmi: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 25,000 (or 0 if no loans)"
                          className="mt-2 h-12 text-lg"
                          data-testid="input-loan-emi"
                        />
                      </div>

                      {formData.loanEmi && parseInt(parseIndianNumber(formData.loanEmi)) > 0 && (
                        <div>
                          <Label htmlFor="loanYearsLeft" className="text-base">How many years until loans are paid off?</Label>
                          <Input
                            id="loanYearsLeft"
                            type="number"
                            value={formData.loanYearsLeft}
                            onChange={(e) => setFormData({ ...formData, loanYearsLeft: e.target.value })}
                            placeholder="e.g., 15"
                            className="mt-2 h-12 text-lg"
                            data-testid="input-loan-years"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {(formData.totalAssets || formData.loanEmi) && (
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl border border-purple-200 dark:border-purple-900">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-total-assets">
                            ₹{formatIndianNumber(formData.totalAssets || "0")}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                          <div className="text-2xl font-bold text-foreground" data-testid="text-monthly-emi">
                            ₹{formatIndianNumber(formData.loanEmi || "0")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Dream Retirement */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto mb-4">
                    <Palmtree className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Dream retirement</h2>
                  <p className="text-muted-foreground">What does freedom look like for you?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">What lifestyle do you want in retirement?</Label>
                    <RadioGroup 
                      value={formData.lifestyleChoice} 
                      onValueChange={(value) => setFormData({ ...formData, lifestyleChoice: value })}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="modest" id="modest" className="peer sr-only" />
                        <Label
                          htmlFor="modest"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-modest"
                        >
                          <span className="text-lg font-semibold mb-1">Modest</span>
                          <span className="text-xs text-center text-muted-foreground">Simple living, basic comforts</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="comfortable" id="comfortable" className="peer sr-only" />
                        <Label
                          htmlFor="comfortable"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-comfortable"
                        >
                          <span className="text-lg font-semibold mb-1">Comfortable</span>
                          <span className="text-xs text-center text-muted-foreground">Current lifestyle maintained</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="luxury" id="luxury" className="peer sr-only" />
                        <Label
                          htmlFor="luxury"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-luxury"
                        >
                          <span className="text-lg font-semibold mb-1">Luxury</span>
                          <span className="text-xs text-center text-muted-foreground">Premium lifestyle, frequent travel</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="nomadic" id="nomadic" className="peer sr-only" />
                        <Label
                          htmlFor="nomadic"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-nomadic"
                        >
                          <span className="text-lg font-semibold mb-1">Nomadic</span>
                          <span className="text-xs text-center text-muted-foreground">Adventure & exploration</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">Where do you plan to retire?</Label>
                    <Select 
                      value={formData.retirementLocation} 
                      onValueChange={(value) => setFormData({ ...formData, retirementLocation: value })}
                    >
                      <SelectTrigger className="h-12 text-lg" data-testid="select-retirement-location">
                        <SelectValue placeholder="Select retirement location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current_city">Current city (Metro)</SelectItem>
                        <SelectItem value="tier2">Tier-2 city (Lower cost)</SelectItem>
                        <SelectItem value="village">Village/Hometown</SelectItem>
                        <SelectItem value="abroad">Abroad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base">How long do you expect to live in retirement?</Label>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {formData.longevityYears} years
                      </Badge>
                    </div>
                    <Slider
                      value={[formData.longevityYears]}
                      onValueChange={(value) => setFormData({ ...formData, longevityYears: value[0] })}
                      min={15}
                      max={40}
                      step={5}
                      className="mt-2"
                      data-testid="slider-longevity"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>15 years</span>
                      <span>27 years</span>
                      <span>40 years</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Life expectancy is 85 years. Adjust based on your health and family history.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Risk & Route */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Your investment DNA</h2>
                  <p className="text-muted-foreground">Let's understand your risk profile</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">
                      If your portfolio drops 20% in a market crash, you would:
                    </Label>
                    <RadioGroup 
                      value={formData.portfolioDropReaction} 
                      onValueChange={(value) => setFormData({ ...formData, portfolioDropReaction: value })}
                      className="space-y-3"
                    >
                      <div>
                        <RadioGroupItem value="sleep_fine" id="sleep_fine" className="peer sr-only" />
                        <Label
                          htmlFor="sleep_fine"
                          className="flex items-start justify-start rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-sleep-fine"
                        >
                          <div className="flex-1">
                            <span className="text-base font-semibold block mb-1">Sleep fine and maybe buy more</span>
                            <span className="text-sm text-muted-foreground">You understand markets recover over time</span>
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="worried" id="worried" className="peer sr-only" />
                        <Label
                          htmlFor="worried"
                          className="flex items-start justify-start rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-worried"
                        >
                          <div className="flex-1">
                            <span className="text-base font-semibold block mb-1">Feel worried but stay invested</span>
                            <span className="text-sm text-muted-foreground">Volatility bothers you but you won't panic</span>
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="panic" id="panic" className="peer sr-only" />
                        <Label
                          htmlFor="panic"
                          className="flex items-start justify-start rounded-lg border-2 border-muted bg-background p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          data-testid="radio-panic"
                        >
                          <div className="flex-1">
                            <span className="text-base font-semibold block mb-1">Panic and sell everything</span>
                            <span className="text-sm text-muted-foreground">You can't handle seeing losses</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base">What matters more to you?</Label>
                      <Badge variant="secondary" className="text-base font-bold">
                        {formData.incomeVsGrowthPreference < 40 ? 'Regular Income' : 
                         formData.incomeVsGrowthPreference > 60 ? 'Long-term Growth' : 'Balanced'}
                      </Badge>
                    </div>
                    <Slider
                      value={[formData.incomeVsGrowthPreference]}
                      onValueChange={(value) => setFormData({ ...formData, incomeVsGrowthPreference: value[0] })}
                      min={0}
                      max={100}
                      step={10}
                      className="mt-2"
                      data-testid="slider-income-growth"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Regular Income</span>
                      <span>Balanced</span>
                      <span>Long-term Growth</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Regular income means steady dividends/interest. Growth means letting money compound for the long run.
                    </p>
                  </div>
                </div>
              </motion.div>
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
                disabled={!isStepValid() || createPlanMutation.isPending}
                className="min-w-40"
              >
                {createPlanMutation.isPending ? (
                  "Creating Your Roadmap..."
                ) : currentStep === totalSteps ? (
                  <>
                    Complete & View Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
