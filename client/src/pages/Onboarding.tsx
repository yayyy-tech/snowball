import { useState, useEffect } from "react";
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
import { Heart, TrendingUp, Building, Palmtree, Target, Sparkles, ArrowRight, Lock, Baby, Users, AlertTriangle, Home, Wallet, CreditCard, PiggyBank, Shield, GraduationCap, HeartPulse } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MiniStory } from "@/components/MiniStory";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, isAuthenticated, isLoading, login } = useAuth();

  // Form state - simplified for 5-step flow (MUST be before early returns)
  const [formData, setFormData] = useState({
    // Step 1: Life Snapshot - Basic
    fullName: "",
    age: "",
    retirementAge: "60",
    maritalStatus: "",
    
    // Step 1: Life Snapshot - Spouse/Partner
    spouseHasIncome: "",  // "yes" or "no"
    spouseIncome: "",
    
    // Step 1: Life Snapshot - Dependents Breakdown
    numberOfChildren: "0",
    childrenAges: [] as string[],
    parentsFinanciallyDependent: "", // "yes" or "no"
    
    // Step 1: Life Snapshot - Major Life Expenses
    expectMajorExpenses: "", // "yes" or "no"
    weddingCount: "0",
    weddingCost: "",
    weddingYears: "",
    educationCount: "0",
    educationCost: "",
    educationYears: "",
    expectedMedicalCost: "",
    
    // Step 1: Life Snapshot - Health Risk
    hasMajorHealthConditions: "", // "yes" or "no"
    currentHealthRating: "", // "good", "average", "poor"
    familyChronicIllnessHistory: "", // "yes" or "no"
    
    // Step 2: Money Flow
    monthlyIncome: "",
    monthlySavings: "", // direct amount instead of percentage
    monthlyExpenses: "", // direct amount instead of percentage
    
    // Step 3: Assets Breakdown
    propertyPrimaryValue: "",
    realEstateInvestmentValue: "",
    stocksMutualFundsValue: "",
    ppfNpsValue: "",
    fdBondsValue: "",
    goldJewelryValue: "",
    cashLiquidValue: "",
    excludePrimaryProperty: true,
    
    // Step 3: Emergency Fund
    emergencyFundMonths: "",
    
    // Step 3: Liabilities Breakdown
    homeLoanEmi: "",
    homeLoanYearsLeft: "",
    carLoanEmi: "",
    carLoanYearsLeft: "",
    personalLoanEmi: "",
    personalLoanYearsLeft: "",
    creditCardDebt: "",
    
    // Legacy fields for compatibility
    totalAssets: "",
    loanEmi: "",
    loanYearsLeft: "",
    dependents: "0",
    
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

  // Show auth gate if not authenticated (AFTER all hooks)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              To create your personalized retirement plan and access all features including expense tracking, 
              AI-powered scenario analysis, and chatbot assistant, please log in with your Google account.
            </p>
            <Button 
              size="lg" 
              onClick={() => login()}
              data-testid="button-login-onboarding"
            >
              Log In with Google
            </Button>
          </Card>
        </main>
      </div>
    );
  }

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
      
      // Calculate total assets from breakdown
      const propertyPrimaryValue = parseInt(parseIndianNumber(formData.propertyPrimaryValue)) || 0;
      const realEstateInvestmentValue = parseInt(parseIndianNumber(formData.realEstateInvestmentValue)) || 0;
      const stocksMutualFundsValue = parseInt(parseIndianNumber(formData.stocksMutualFundsValue)) || 0;
      const ppfNpsValue = parseInt(parseIndianNumber(formData.ppfNpsValue)) || 0;
      const fdBondsValue = parseInt(parseIndianNumber(formData.fdBondsValue)) || 0;
      const goldJewelryValue = parseInt(parseIndianNumber(formData.goldJewelryValue)) || 0;
      const cashLiquidValue = parseInt(parseIndianNumber(formData.cashLiquidValue)) || 0;
      
      // For retirement corpus: exclude primary property if flag is set
      const calculatedTotalAssets = formData.excludePrimaryProperty
        ? realEstateInvestmentValue + stocksMutualFundsValue + ppfNpsValue + fdBondsValue + goldJewelryValue + cashLiquidValue
        : propertyPrimaryValue + realEstateInvestmentValue + stocksMutualFundsValue + ppfNpsValue + fdBondsValue + goldJewelryValue + cashLiquidValue;
      
      // Calculate total EMI from breakdown
      const homeLoanEmiValue = parseInt(parseIndianNumber(formData.homeLoanEmi)) || 0;
      const carLoanEmiValue = parseInt(parseIndianNumber(formData.carLoanEmi)) || 0;
      const personalLoanEmiValue = parseInt(parseIndianNumber(formData.personalLoanEmi)) || 0;
      const creditCardDebtValue = parseInt(parseIndianNumber(formData.creditCardDebt)) || 0;
      const calculatedTotalEmi = homeLoanEmiValue + carLoanEmiValue + personalLoanEmiValue;
      
      // Calculate dependents from breakdown
      const numberOfChildren = parseInt(formData.numberOfChildren) || 0;
      const parentsDependent = formData.parentsFinanciallyDependent === "yes" ? 1 : 0;
      const calculatedDependents = numberOfChildren + parentsDependent;
      
      // Build major life expenses object
      const majorLifeExpenses: any = {};
      if (formData.expectMajorExpenses === "yes") {
        if (parseInt(formData.weddingCount) > 0) {
          const weddingYearsArray = formData.weddingYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
          majorLifeExpenses.weddings = {
            count: parseInt(formData.weddingCount),
            avgCost: parseInt(parseIndianNumber(formData.weddingCost)) || 2000000,
            yearsFromNow: weddingYearsArray.length > 0 ? weddingYearsArray : [10]
          };
        }
        if (parseInt(formData.educationCount) > 0) {
          const eduYearsArray = formData.educationYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
          majorLifeExpenses.education = {
            count: parseInt(formData.educationCount),
            avgCost: parseInt(parseIndianNumber(formData.educationCost)) || 1500000,
            yearsFromNow: eduYearsArray.length > 0 ? eduYearsArray : [15]
          };
        }
        if (formData.expectedMedicalCost) {
          majorLifeExpenses.medical = {
            estimatedCost: parseInt(parseIndianNumber(formData.expectedMedicalCost)) || 500000,
            yearsFromNow: 5
          };
        }
      }
      
      const planData = {
        fullName: formData.fullName,
        currentAge,
        retirementAge,
        gender: 'male', // Default
        maritalStatus: formData.maritalStatus,
        dependents: calculatedDependents,
        
        monthlyIncome,
        employmentType: 'salaried',
        spouseName: null,
        spouseAge: null,
        spouseWorking: formData.spouseHasIncome === "yes",
        spouseIncome: formData.spouseHasIncome === "yes" ? parseInt(parseIndianNumber(formData.spouseIncome)) || 0 : null,
        
        // NEW: Life Snapshot - Spouse/Partner
        spouseHasIncome: formData.spouseHasIncome === "yes",
        
        // NEW: Life Snapshot - Dependents Breakdown
        numberOfChildren,
        childrenAges: formData.childrenAges,
        parentsFinanciallyDependent: formData.parentsFinanciallyDependent === "yes",
        majorLifeExpenses: Object.keys(majorLifeExpenses).length > 0 ? majorLifeExpenses : null,
        
        // NEW: Life Snapshot - Health Risk
        hasMajorHealthConditions: formData.hasMajorHealthConditions === "yes",
        currentHealthRating: formData.currentHealthRating || "average",
        familyChronicIllnessHistory: formData.familyChronicIllnessHistory === "yes",
        
        // New fields for 5-step flow
        savingsRate, // Calculated from monthlySavings / monthlyIncome
        essentialExpenseRatio, // Default 60% - for backend calculations
        lifestyleExpenseRatio,
        totalAssets: calculatedTotalAssets,
        loanEmi: calculatedTotalEmi,
        loanYearsLeft: parseInt(formData.homeLoanYearsLeft) || 0,
        
        // NEW: Assets Breakdown
        propertyPrimaryValue,
        realEstateInvestmentValue,
        stocksMutualFundsValue,
        ppfNpsValue,
        fdBondsValue,
        goldJewelryValue,
        cashLiquidValue,
        excludePrimaryPropertyFromRetirement: formData.excludePrimaryProperty,
        excludedAssets: [],
        
        // NEW: Emergency Fund
        emergencyFundMonths: parseInt(formData.emergencyFundMonths) || 0,
        
        // NEW: Liabilities Breakdown
        homeLoanEmiNew: homeLoanEmiValue,
        homeLoanYearsLeft: parseInt(formData.homeLoanYearsLeft) || 0,
        carLoanEmi: carLoanEmiValue,
        carLoanYearsLeft: parseInt(formData.carLoanYearsLeft) || 0,
        personalLoanEmi: personalLoanEmiValue,
        personalLoanYearsLeft: parseInt(formData.personalLoanYearsLeft) || 0,
        creditCardDebt: creditCardDebtValue,
        
        lifestyleChoice: formData.lifestyleChoice,
        retirementLocation: formData.retirementLocation,
        longevityYears: formData.longevityYears,
        portfolioDropReaction: formData.portfolioDropReaction,
        incomeVsGrowthPreference: formData.incomeVsGrowthPreference,
        inferredMonthlyExpense,
        replacementRatio,
        
        // Legacy fields (will be calculated on backend)
        hasHomeLoan: calculatedTotalEmi > 0,
        homeLoanEmi: calculatedTotalEmi,
        homeLoanTenure: parseInt(formData.homeLoanYearsLeft) || 0,
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
                  {/* Basic Info */}
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

                  {/* Spouse Income (shown if married) */}
                  {formData.maritalStatus === "married" && (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <Label className="text-base font-medium">Spouse/Partner Details</Label>
                      </div>
                      <div>
                        <Label className="text-sm">Does your spouse/partner have their own income?</Label>
                        <RadioGroup 
                          value={formData.spouseHasIncome} 
                          onValueChange={(value) => setFormData({ ...formData, spouseHasIncome: value })}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="spouse-income-yes" />
                            <Label htmlFor="spouse-income-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="spouse-income-no" />
                            <Label htmlFor="spouse-income-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {formData.spouseHasIncome === "yes" && (
                        <div>
                          <Label htmlFor="spouseIncome" className="text-sm">Spouse's monthly income</Label>
                          <Input
                            id="spouseIncome"
                            value={formatIndianNumber(formData.spouseIncome)}
                            onChange={(e) => setFormData({ ...formData, spouseIncome: parseIndianNumber(e.target.value) })}
                            placeholder="e.g., 50,000"
                            className="mt-1 h-10"
                            data-testid="input-spouse-income"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dependents Breakdown */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Baby className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Dependents</Label>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numberOfChildren" className="text-sm">Number of children</Label>
                        <Select 
                          value={formData.numberOfChildren} 
                          onValueChange={(value) => {
                            const num = parseInt(value);
                            const newAges = [...formData.childrenAges];
                            while (newAges.length < num) newAges.push("");
                            while (newAges.length > num) newAges.pop();
                            setFormData({ ...formData, numberOfChildren: value, childrenAges: newAges });
                          }}
                        >
                          <SelectTrigger className="mt-1 h-10" data-testid="select-children-count">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {parseInt(formData.numberOfChildren) > 0 && (
                        <div>
                          <Label className="text-sm">Children's ages</Label>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {formData.childrenAges.map((age, index) => (
                              <Input
                                key={index}
                                type="number"
                                value={age}
                                onChange={(e) => {
                                  const newAges = [...formData.childrenAges];
                                  newAges[index] = e.target.value;
                                  setFormData({ ...formData, childrenAges: newAges });
                                }}
                                placeholder={`Child ${index + 1}`}
                                className="w-20 h-10"
                                data-testid={`input-child-age-${index}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm">Are your parents financially dependent on you?</Label>
                      <RadioGroup 
                        value={formData.parentsFinanciallyDependent} 
                        onValueChange={(value) => setFormData({ ...formData, parentsFinanciallyDependent: value })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="parents-yes" />
                          <Label htmlFor="parents-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="parents-no" />
                          <Label htmlFor="parents-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Major Life Expenses */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Major Life Expenses</Label>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Any major life expenses expected in next 10-20 years? (weddings, education, medical)</Label>
                      <RadioGroup 
                        value={formData.expectMajorExpenses} 
                        onValueChange={(value) => setFormData({ ...formData, expectMajorExpenses: value })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="major-exp-yes" />
                          <Label htmlFor="major-exp-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="major-exp-no" />
                          <Label htmlFor="major-exp-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.expectMajorExpenses === "yes" && (
                      <div className="space-y-4 pt-2">
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Weddings</Label>
                            <Select 
                              value={formData.weddingCount} 
                              onValueChange={(value) => setFormData({ ...formData, weddingCount: value })}
                            >
                              <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder="Count" />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {parseInt(formData.weddingCount) > 0 && (
                            <>
                              <div>
                                <Label className="text-xs text-muted-foreground">Avg cost each</Label>
                                <Input
                                  value={formatIndianNumber(formData.weddingCost)}
                                  onChange={(e) => setFormData({ ...formData, weddingCost: parseIndianNumber(e.target.value) })}
                                  placeholder="20,00,000"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Years from now</Label>
                                <Input
                                  value={formData.weddingYears}
                                  onChange={(e) => setFormData({ ...formData, weddingYears: e.target.value })}
                                  placeholder="10, 15"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Education (college/abroad)</Label>
                            <Select 
                              value={formData.educationCount} 
                              onValueChange={(value) => setFormData({ ...formData, educationCount: value })}
                            >
                              <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder="Count" />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {parseInt(formData.educationCount) > 0 && (
                            <>
                              <div>
                                <Label className="text-xs text-muted-foreground">Avg cost each</Label>
                                <Input
                                  value={formatIndianNumber(formData.educationCost)}
                                  onChange={(e) => setFormData({ ...formData, educationCost: parseIndianNumber(e.target.value) })}
                                  placeholder="15,00,000"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Years from now</Label>
                                <Input
                                  value={formData.educationYears}
                                  onChange={(e) => setFormData({ ...formData, educationYears: e.target.value })}
                                  placeholder="8, 12"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Expected medical expenses (if any)</Label>
                          <Input
                            value={formatIndianNumber(formData.expectedMedicalCost)}
                            onChange={(e) => setFormData({ ...formData, expectedMedicalCost: parseIndianNumber(e.target.value) })}
                            placeholder="e.g., 5,00,000 (optional)"
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Health Risk Questions */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HeartPulse className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Health Profile</Label>
                    </div>
                    <p className="text-xs text-muted-foreground -mt-2">This helps us adjust life expectancy and healthcare costs in your plan</p>
                    
                    <div>
                      <Label className="text-sm">How would you rate your current health?</Label>
                      <RadioGroup 
                        value={formData.currentHealthRating} 
                        onValueChange={(value) => setFormData({ ...formData, currentHealthRating: value })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="good" id="health-good" />
                          <Label htmlFor="health-good" className="text-green-600">Good</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="average" id="health-average" />
                          <Label htmlFor="health-average">Average</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="poor" id="health-poor" />
                          <Label htmlFor="health-poor" className="text-orange-600">Poor</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Any major health conditions?</Label>
                        <RadioGroup 
                          value={formData.hasMajorHealthConditions} 
                          onValueChange={(value) => setFormData({ ...formData, hasMajorHealthConditions: value })}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="health-cond-yes" />
                            <Label htmlFor="health-cond-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="health-cond-no" />
                            <Label htmlFor="health-cond-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label className="text-sm">Family history of chronic illness?</Label>
                        <RadioGroup 
                          value={formData.familyChronicIllnessHistory} 
                          onValueChange={(value) => setFormData({ ...formData, familyChronicIllnessHistory: value })}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="family-history-yes" />
                            <Label htmlFor="family-history-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="family-history-no" />
                            <Label htmlFor="family-history-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
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
                  {/* Assets Breakdown */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Assets Breakdown</Label>
                    </div>
                    <p className="text-xs text-muted-foreground -mt-2">Each asset class grows at different rates. This helps us calculate more accurately.</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyPrimaryValue" className="text-sm flex items-center gap-1">
                          <Home className="h-3 w-3" /> Primary Home
                        </Label>
                        <Input
                          id="propertyPrimaryValue"
                          value={formatIndianNumber(formData.propertyPrimaryValue)}
                          onChange={(e) => setFormData({ ...formData, propertyPrimaryValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 80,00,000"
                          className="mt-1 h-10"
                          data-testid="input-property-primary"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox 
                            id="excludePrimaryProperty"
                            checked={formData.excludePrimaryProperty}
                            onCheckedChange={(checked) => setFormData({ ...formData, excludePrimaryProperty: checked as boolean })}
                            data-testid="checkbox-exclude-primary"
                          />
                          <Label htmlFor="excludePrimaryProperty" className="text-xs text-muted-foreground cursor-pointer">
                            Exclude from retirement corpus (you'll live here)
                          </Label>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="realEstateInvestmentValue" className="text-sm">Investment Property</Label>
                        <Input
                          id="realEstateInvestmentValue"
                          value={formatIndianNumber(formData.realEstateInvestmentValue)}
                          onChange={(e) => setFormData({ ...formData, realEstateInvestmentValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 50,00,000"
                          className="mt-1 h-10"
                          data-testid="input-real-estate-investment"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~10%/yr</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="stocksMutualFundsValue" className="text-sm">Stocks & Mutual Funds</Label>
                        <Input
                          id="stocksMutualFundsValue"
                          value={formatIndianNumber(formData.stocksMutualFundsValue)}
                          onChange={(e) => setFormData({ ...formData, stocksMutualFundsValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 15,00,000"
                          className="mt-1 h-10"
                          data-testid="input-stocks-mf"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~12%/yr</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="ppfNpsValue" className="text-sm">PPF / NPS / EPF (locked-in)</Label>
                        <Input
                          id="ppfNpsValue"
                          value={formatIndianNumber(formData.ppfNpsValue)}
                          onChange={(e) => setFormData({ ...formData, ppfNpsValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 10,00,000"
                          className="mt-1 h-10"
                          data-testid="input-ppf-nps"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~7.5%/yr</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="fdBondsValue" className="text-sm">FD / Bonds (liquid)</Label>
                        <Input
                          id="fdBondsValue"
                          value={formatIndianNumber(formData.fdBondsValue)}
                          onChange={(e) => setFormData({ ...formData, fdBondsValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 5,00,000"
                          className="mt-1 h-10"
                          data-testid="input-fd-bonds"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~6%/yr</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="goldJewelryValue" className="text-sm">Gold / Jewelry</Label>
                        <Input
                          id="goldJewelryValue"
                          value={formatIndianNumber(formData.goldJewelryValue)}
                          onChange={(e) => setFormData({ ...formData, goldJewelryValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 3,00,000"
                          className="mt-1 h-10"
                          data-testid="input-gold"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~8%/yr</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="cashLiquidValue" className="text-sm">Cash / Savings Account</Label>
                        <Input
                          id="cashLiquidValue"
                          value={formatIndianNumber(formData.cashLiquidValue)}
                          onChange={(e) => setFormData({ ...formData, cashLiquidValue: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 2,00,000"
                          className="mt-1 h-10"
                          data-testid="input-cash"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Grows ~4%/yr</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Fund */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Emergency Fund</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyFundMonths" className="text-sm">How many months of expenses do you have saved as emergency fund?</Label>
                      <Select 
                        value={formData.emergencyFundMonths} 
                        onValueChange={(value) => setFormData({ ...formData, emergencyFundMonths: value })}
                      >
                        <SelectTrigger className="mt-1 h-10" data-testid="select-emergency-fund">
                          <SelectValue placeholder="Select months" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 9, 12, 18, 24].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} months</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.emergencyFundMonths && parseInt(formData.emergencyFundMonths) < 6 && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Less than 6 months emergency fund will limit equity exposure to 30%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Liabilities Breakdown */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Liabilities</Label>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="homeLoanEmi" className="text-sm">Home Loan EMI</Label>
                        <Input
                          id="homeLoanEmi"
                          value={formatIndianNumber(formData.homeLoanEmi)}
                          onChange={(e) => setFormData({ ...formData, homeLoanEmi: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 25,000"
                          className="mt-1 h-10"
                          data-testid="input-home-loan-emi"
                        />
                      </div>
                      {formData.homeLoanEmi && parseInt(parseIndianNumber(formData.homeLoanEmi)) > 0 && (
                        <div>
                          <Label htmlFor="homeLoanYearsLeft" className="text-sm">Years left</Label>
                          <Input
                            id="homeLoanYearsLeft"
                            type="number"
                            value={formData.homeLoanYearsLeft}
                            onChange={(e) => setFormData({ ...formData, homeLoanYearsLeft: e.target.value })}
                            placeholder="15"
                            className="mt-1 h-10"
                            data-testid="input-home-loan-years"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="carLoanEmi" className="text-sm">Car Loan EMI</Label>
                        <Input
                          id="carLoanEmi"
                          value={formatIndianNumber(formData.carLoanEmi)}
                          onChange={(e) => setFormData({ ...formData, carLoanEmi: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 15,000"
                          className="mt-1 h-10"
                          data-testid="input-car-loan-emi"
                        />
                      </div>
                      {formData.carLoanEmi && parseInt(parseIndianNumber(formData.carLoanEmi)) > 0 && (
                        <div>
                          <Label htmlFor="carLoanYearsLeft" className="text-sm">Years left</Label>
                          <Input
                            id="carLoanYearsLeft"
                            type="number"
                            value={formData.carLoanYearsLeft}
                            onChange={(e) => setFormData({ ...formData, carLoanYearsLeft: e.target.value })}
                            placeholder="3"
                            className="mt-1 h-10"
                            data-testid="input-car-loan-years"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="personalLoanEmi" className="text-sm">Personal Loan EMI</Label>
                        <Input
                          id="personalLoanEmi"
                          value={formatIndianNumber(formData.personalLoanEmi)}
                          onChange={(e) => setFormData({ ...formData, personalLoanEmi: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 10,000"
                          className="mt-1 h-10"
                          data-testid="input-personal-loan-emi"
                        />
                      </div>
                      {formData.personalLoanEmi && parseInt(parseIndianNumber(formData.personalLoanEmi)) > 0 && (
                        <div>
                          <Label htmlFor="personalLoanYearsLeft" className="text-sm">Years left</Label>
                          <Input
                            id="personalLoanYearsLeft"
                            type="number"
                            value={formData.personalLoanYearsLeft}
                            onChange={(e) => setFormData({ ...formData, personalLoanYearsLeft: e.target.value })}
                            placeholder="2"
                            className="mt-1 h-10"
                            data-testid="input-personal-loan-years"
                          />
                        </div>
                      )}
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="creditCardDebt" className="text-sm">Credit Card Outstanding Balance</Label>
                        <Input
                          id="creditCardDebt"
                          value={formatIndianNumber(formData.creditCardDebt)}
                          onChange={(e) => setFormData({ ...formData, creditCardDebt: parseIndianNumber(e.target.value) })}
                          placeholder="e.g., 50,000 (or 0)"
                          className="mt-1 h-10"
                          data-testid="input-credit-card-debt"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {(() => {
                    const totalAssetsCalc = 
                      (parseInt(parseIndianNumber(formData.realEstateInvestmentValue)) || 0) +
                      (parseInt(parseIndianNumber(formData.stocksMutualFundsValue)) || 0) +
                      (parseInt(parseIndianNumber(formData.ppfNpsValue)) || 0) +
                      (parseInt(parseIndianNumber(formData.fdBondsValue)) || 0) +
                      (parseInt(parseIndianNumber(formData.goldJewelryValue)) || 0) +
                      (parseInt(parseIndianNumber(formData.cashLiquidValue)) || 0);
                    const totalEmiCalc = 
                      (parseInt(parseIndianNumber(formData.homeLoanEmi)) || 0) +
                      (parseInt(parseIndianNumber(formData.carLoanEmi)) || 0) +
                      (parseInt(parseIndianNumber(formData.personalLoanEmi)) || 0);
                    const primaryProperty = parseInt(parseIndianNumber(formData.propertyPrimaryValue)) || 0;
                    
                    if (totalAssetsCalc > 0 || totalEmiCalc > 0 || primaryProperty > 0) {
                      return (
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl border border-purple-200 dark:border-purple-900">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Retirement Assets</p>
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-retirement-assets">
                                ₹{formatIndianNumber(totalAssetsCalc.toString())}
                              </div>
                              <p className="text-xs text-muted-foreground">(Excluding primary home)</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Primary Home</p>
                              <div className="text-xl font-semibold text-muted-foreground" data-testid="text-primary-home">
                                ₹{formatIndianNumber(primaryProperty.toString())}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                              <div className="text-2xl font-bold text-foreground" data-testid="text-monthly-emi">
                                ₹{formatIndianNumber(totalEmiCalc.toString())}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
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
