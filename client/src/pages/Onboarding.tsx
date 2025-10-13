import { useState } from "react";
import { Header } from "@/components/Header";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useLocation } from "wouter";
import { Plus, Trash2, Heart } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    income: "",
    debts: "",
    existingInvestments: "",
    monthlySavings: "",
    retirementAge: "",
    expensesPlannedAge: "",
    riskAppetite: "",
    hasHouse: "",
    dependents: [] as string[],
    loans: [] as any[],
    hasKids: "",
    kidsEducation: false,
    kidsWedding: false,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted:", formData);
      setLocation("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addLoan = () => {
    setFormData({
      ...formData,
      loans: [...formData.loans, { amount: "", emi: "", tenure: "", startDate: "" }],
    });
  };

  const removeLoan = (index: number) => {
    setFormData({
      ...formData,
      loans: formData.loans.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

        <Card className="max-w-3xl mx-auto p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Let's get to know you</h2>
                <p className="text-muted-foreground">Tell us about yourself to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    data-testid="input-name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Your age"
                      data-testid="input-age"
                    />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                          <Label htmlFor="male" className="font-normal">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                          <Label htmlFor="female" className="font-normal">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                          <Label htmlFor="other" className="font-normal">Other</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Financial Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Financial Profile</h2>
                <p className="text-muted-foreground">Help us understand your current financial situation</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    placeholder="e.g., 1200000"
                    data-testid="input-income"
                  />
                </div>

                <div>
                  <Label htmlFor="debts">Total Debts (₹)</Label>
                  <Input
                    id="debts"
                    type="number"
                    value={formData.debts}
                    onChange={(e) => setFormData({ ...formData, debts: e.target.value })}
                    placeholder="e.g., 500000"
                    data-testid="input-debts"
                  />
                </div>

                <div>
                  <Label htmlFor="investments">Existing Investments (₹)</Label>
                  <Input
                    id="investments"
                    type="number"
                    value={formData.existingInvestments}
                    onChange={(e) => setFormData({ ...formData, existingInvestments: e.target.value })}
                    placeholder="e.g., 300000"
                    data-testid="input-investments"
                  />
                </div>

                <div>
                  <Label htmlFor="savings">Monthly Savings (₹)</Label>
                  <Input
                    id="savings"
                    type="number"
                    value={formData.monthlySavings}
                    onChange={(e) => setFormData({ ...formData, monthlySavings: e.target.value })}
                    placeholder="e.g., 25000"
                    data-testid="input-savings"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Retirement Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Retirement Planning</h2>
                <p className="text-muted-foreground">When do you plan to retire and how long should your money last?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="retirementAge">Target Retirement Age</Label>
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
                  <Label htmlFor="expensesAge">Expenses Planned Until Age</Label>
                  <Input
                    id="expensesAge"
                    type="number"
                    value={formData.expensesPlannedAge}
                    onChange={(e) => setFormData({ ...formData, expensesPlannedAge: e.target.value })}
                    placeholder="e.g., 85"
                    data-testid="input-expenses-age"
                  />
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-chart-2" />
                    <span>We hope you live the longest!</span>
                  </div>
                </div>

                <div>
                  <Label>Risk Appetite</Label>
                  <RadioGroup
                    value={formData.riskAppetite}
                    onValueChange={(value) => setFormData({ ...formData, riskAppetite: value })}
                  >
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" data-testid="radio-risk-low" />
                        <Label htmlFor="low" className="font-normal">Low - I prefer stable returns</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" data-testid="radio-risk-moderate" />
                        <Label htmlFor="moderate" className="font-normal">Moderate - Balanced approach</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" data-testid="radio-risk-high" />
                        <Label htmlFor="high" className="font-normal">High - I can handle volatility</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Dependents & Housing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Family & Housing</h2>
                <p className="text-muted-foreground">Tell us about your dependents and housing status</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Do you own a house?</Label>
                  <RadioGroup
                    value={formData.hasHouse}
                    onValueChange={(value) => setFormData({ ...formData, hasHouse: value })}
                  >
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="house-yes" data-testid="radio-house-yes" />
                        <Label htmlFor="house-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="house-no" data-testid="radio-house-no" />
                        <Label htmlFor="house-no" className="font-normal">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Number of Dependents</Label>
                  <Slider
                    value={[formData.dependents.length]}
                    onValueChange={(value) => {
                      const count = value[0];
                      setFormData({
                        ...formData,
                        dependents: Array(count).fill(""),
                      });
                    }}
                    max={5}
                    step={1}
                    className="mt-4"
                    data-testid="slider-dependents"
                  />
                  <p className="text-sm text-muted-foreground mt-2">{formData.dependents.length} dependents</p>
                </div>

                <div>
                  <Label>Do you have or plan to have children?</Label>
                  <RadioGroup
                    value={formData.hasKids}
                    onValueChange={(value) => setFormData({ ...formData, hasKids: value })}
                  >
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="kids-yes" data-testid="radio-kids-yes" />
                        <Label htmlFor="kids-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="kids-no" data-testid="radio-kids-no" />
                        <Label htmlFor="kids-no" className="font-normal">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {formData.hasKids === "yes" && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <Label>Future Planning for Children</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="education"
                          checked={formData.kidsEducation}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, kidsEducation: checked as boolean })
                          }
                          data-testid="checkbox-education"
                        />
                        <Label htmlFor="education" className="font-normal">Education expenses</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wedding"
                          checked={formData.kidsWedding}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, kidsWedding: checked as boolean })
                          }
                          data-testid="checkbox-wedding"
                        />
                        <Label htmlFor="wedding" className="font-normal">Wedding expenses</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Loans */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Loan Information</h2>
                <p className="text-muted-foreground">Add details about your ongoing loans</p>
              </div>

              <div className="space-y-4">
                {formData.loans.map((loan, index) => (
                  <Card key={index} className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Loan {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLoan(index)}
                        data-testid={`button-remove-loan-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Loan Amount (₹)</Label>
                        <Input
                          type="number"
                          value={loan.amount}
                          onChange={(e) => {
                            const newLoans = [...formData.loans];
                            newLoans[index].amount = e.target.value;
                            setFormData({ ...formData, loans: newLoans });
                          }}
                          placeholder="e.g., 500000"
                          data-testid={`input-loan-amount-${index}`}
                        />
                      </div>

                      <div>
                        <Label>EMI Amount (₹)</Label>
                        <Input
                          type="number"
                          value={loan.emi}
                          onChange={(e) => {
                            const newLoans = [...formData.loans];
                            newLoans[index].emi = e.target.value;
                            setFormData({ ...formData, loans: newLoans });
                          }}
                          placeholder="e.g., 15000"
                          data-testid={`input-loan-emi-${index}`}
                        />
                      </div>

                      <div>
                        <Label>Tenure (months)</Label>
                        <Input
                          type="number"
                          value={loan.tenure}
                          onChange={(e) => {
                            const newLoans = [...formData.loans];
                            newLoans[index].tenure = e.target.value;
                            setFormData({ ...formData, loans: newLoans });
                          }}
                          placeholder="e.g., 60"
                          data-testid={`input-loan-tenure-${index}`}
                        />
                      </div>

                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={loan.startDate}
                          onChange={(e) => {
                            const newLoans = [...formData.loans];
                            newLoans[index].startDate = e.target.value;
                            setFormData({ ...formData, loans: newLoans });
                          }}
                          data-testid={`input-loan-date-${index}`}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  onClick={addLoan}
                  className="w-full"
                  data-testid="button-add-loan"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Loan
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Review & Warnings */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Almost There!</h2>
                <p className="text-muted-foreground">Review important information before we create your plan</p>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Important Notice
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Our calculations are precise, but we recommend maintaining <strong>10-15% higher savings</strong> than suggested to account for unexpected life events and market volatility.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    What's Included
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>✓ Fixed 6% inflation rate applied to all projections</li>
                    <li>✓ Automatic 7% SIP step-up recommendations</li>
                    <li>✓ Tax calculations based on India's new tax regime</li>
                    <li>✓ 12% corpus buffer for unexpected expenses (wedding, education, health)</li>
                    <li>✓ Loan EMI adjustments in retirement cashflow</li>
                    <li>✓ Post-retirement SWP (Systematic Withdrawal Plan) calculations</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-3">Your Summary</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{formData.name || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <span className="ml-2 font-medium">{formData.age || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Retirement Age:</span>
                      <span className="ml-2 font-medium">{formData.retirementAge || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk Appetite:</span>
                      <span className="ml-2 font-medium capitalize">{formData.riskAppetite || "Not provided"}</span>
                    </div>
                  </div>
                </div>
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
            <Button onClick={handleNext} data-testid="button-next">
              {currentStep === totalSteps ? "Generate Roadmap" : "Continue"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
