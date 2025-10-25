/**
 * Comprehensive Debug Test for Snowball Retirement Calculations
 * Tests expense calculations, EMI handling, SIP calculations, corpus calculations,
 * tax calculations, and Freedom Score
 */

import { calculateRetirementPlan } from "./calculations";
import { calculateFreedomScore, calculateRiskScore, inferMonthlyExpense } from "./aiInference";
import type { RetirementPlan } from "@shared/schema";

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function pass(msg: string) {
  console.log(`${colors.green}✓ ${msg}${colors.reset}`);
}

function fail(msg: string, expected?: any, actual?: any) {
  console.log(`${colors.red}✗ ${msg}${colors.reset}`);
  if (expected !== undefined && actual !== undefined) {
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
  }
}

function section(title: string) {
  console.log(`\n${colors.bold}${colors.blue}═══ ${title} ═══${colors.reset}\n`);
}

function testResult(passed: number, total: number) {
  const percentage = Math.round((passed / total) * 100);
  const color = percentage === 100 ? colors.green : percentage >= 80 ? colors.yellow : colors.red;
  console.log(`\n${color}${colors.bold}Results: ${passed}/${total} tests passed (${percentage}%)${colors.reset}\n`);
  return percentage === 100;
}

// Helper to create test plan
function createTestPlan(overrides: Partial<RetirementPlan>): RetirementPlan {
  const defaults: RetirementPlan = {
    id: "test-plan",
    userId: null,
    fullName: "Test User",
    currentAge: 30,
    retirementAge: 60,
    gender: "male",
    maritalStatus: "single",
    dependents: 0,
    monthlyIncome: 100000,
    employmentType: "salaried",
    spouseName: null,
    spouseAge: null,
    spouseWorking: false,
    spouseIncome: null,
    
    // 5-step flow fields
    savingsRate: 20,
    essentialExpenseRatio: 60,
    lifestyleExpenseRatio: 40,
    totalAssets: 500000,
    loanEmi: 15000,
    loanYearsLeft: 15,
    lifestyleChoice: "comfortable",
    retirementLocation: "Pune",
    longevityYears: null,
    portfolioDropReaction: "worried",
    incomeVsGrowthPreference: 50,
    riskScore: 3,
    
    // AI calculated
    freedomScore: null,
    inferredMonthlyExpense: 60000,
    replacementRatio: 90,
    
    // Legacy fields
    hasHomeLoan: true,
    homeLoanEmi: 15000,
    homeLoanTenure: 15,
    realEstateValue: 0,
    stocksValue: 0,
    mutualFundsValue: 0,
    ppfEpfNps: 0,
    bankDeposits: 0,
    goldAssets: 0,
    retirementLifestyle: "comfortable",
    postRetirementMonthlyExpense: 54000,
    legacyGoal: 0,
    majorExpenses: [],
    riskTolerance: "moderate",
    investmentExperience: "intermediate",
    preferredAssetMix: "balanced-growth",
    taxRegime: "new",
    section80CInvestment: 0,
    calculatedPlan: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return { ...defaults, ...overrides };
}

// Test 1: Expense Calculation Tests
function testExpenseCalculations() {
  section("TEST 1: Expense Calculation");
  let passed = 0;
  const total = 4;
  
  // Test 1a: User's actual expense input should be used (with inflation over 30 years)
  const plan1 = createTestPlan({
    monthlyIncome: 100000,
    inferredMonthlyExpense: 60000, // User entered ₹60K
    postRetirementMonthlyExpense: 54000, // 90% replacement ratio
  });
  const result1 = calculateRetirementPlan(plan1);
  // Expected: 54000 * (1.06^30) ≈ 310,000
  if (result1.monthlyExpenseAtRetirement > 250000 && result1.monthlyExpenseAtRetirement < 350000) {
    pass(`User's actual expense (₹60K) is used with inflation (₹${Math.round(result1.monthlyExpenseAtRetirement/1000)}K at retirement)`);
    passed++;
  } else {
    fail("User's actual expense not used correctly", "250K-350K (inflated)", result1.monthlyExpenseAtRetirement);
  }
  
  // Test 1b: AI inference fallback when no user input
  const plan2 = createTestPlan({
    monthlyIncome: 100000,
    inferredMonthlyExpense: null,
    postRetirementMonthlyExpense: null,
    replacementRatio: null, // Don't apply replacement ratio for this test
  });
  const result2 = calculateRetirementPlan(plan2);
  const inferred = inferMonthlyExpense(100000, 0);
  if (Math.abs(result2.monthlyExpenseAtRetirement / Math.pow(1.06, 30) - inferred) < 1000) {
    pass(`AI inference fallback works correctly (inferred ₹${inferred.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("AI inference fallback incorrect");
  }
  
  // Test 1c: Low income expense ratio (85%)
  const plan3 = createTestPlan({
    monthlyIncome: 40000,
    inferredMonthlyExpense: null,
    postRetirementMonthlyExpense: null, // Let it infer
  });
  const result3 = calculateRetirementPlan(plan3);
  const expectedLow = Math.round(40000 * 0.85);
  const inflatedLow = expectedLow * Math.pow(1.06, 30);
  if (Math.abs(result3.monthlyExpenseAtRetirement - inflatedLow) < inflatedLow * 0.1) {
    pass(`Low income (₹40K) uses 85% expense ratio correctly (₹${expectedLow.toLocaleString('en-IN')} → ₹${Math.round(result3.monthlyExpenseAtRetirement/1000)}K)`);
    passed++;
  } else {
    fail("Low income expense ratio incorrect", `≈${Math.round(inflatedLow)}`, result3.monthlyExpenseAtRetirement);
  }
  
  // Test 1d: High income expense ratio (65%)
  const plan4 = createTestPlan({
    monthlyIncome: 200000,
    inferredMonthlyExpense: null,
    postRetirementMonthlyExpense: null, // Let it infer
  });
  const result4 = calculateRetirementPlan(plan4);
  const expectedHigh = Math.round(200000 * 0.65);
  const inflatedHigh = expectedHigh * Math.pow(1.06, 30);
  if (Math.abs(result4.monthlyExpenseAtRetirement - inflatedHigh) < inflatedHigh * 0.1) {
    pass(`High income (₹2L) uses 65% expense ratio correctly (₹${expectedHigh.toLocaleString('en-IN')} → ₹${Math.round(result4.monthlyExpenseAtRetirement/1000)}K)`);
    passed++;
  } else {
    fail("High income expense ratio incorrect", `≈${Math.round(inflatedHigh)}`, result4.monthlyExpenseAtRetirement);
  }
  
  return testResult(passed, total);
}

// Test 2: EMI Handling Tests
function testEMIHandling() {
  section("TEST 2: EMI Handling");
  let passed = 0;
  const total = 3;
  
  // Test 2a: EMI should NOT be double-subtracted in 5-step flow
  const plan1 = createTestPlan({
    monthlyIncome: 100000,
    savingsRate: 20, // Already accounts for EMI
    loanEmi: 15000,
    inferredMonthlyExpense: 60000, // Includes EMI
  });
  const result1 = calculateRetirementPlan(plan1);
  const expectedSavings = 100000 * 0.20;
  if (Math.abs(result1.monthlySavings - expectedSavings) < 10) {
    pass(`EMI not double-subtracted in 5-step flow (savings: ₹${result1.monthlySavings.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("EMI double-subtraction detected in 5-step flow", expectedSavings, result1.monthlySavings);
  }
  
  // Test 2b: EMI validation warning for suspicious ratios
  const plan2 = createTestPlan({
    loanEmi: 50000,
    inferredMonthlyExpense: 55000, // EMI is 91% of expenses - suspicious
  });
  // This test just checks that it doesn't crash - warning is logged
  const result2 = calculateRetirementPlan(plan2);
  if (result2.monthlySavings >= 0) {
    pass("EMI validation warning system works without crashing");
    passed++;
  } else {
    fail("EMI validation caused calculation error");
  }
  
  // Test 2c: Loan end year projection
  const plan3 = createTestPlan({
    loanEmi: 20000,
    loanYearsLeft: 10,
    currentAge: 30,
    retirementAge: 60,
  });
  const result3 = calculateRetirementPlan(plan3);
  if (result3.loanEndYear === 10 && result3.additionalSavingsAfterLoan === 20000) {
    pass(`Loan end year correctly calculated (year ${result3.loanEndYear}, +₹${result3.additionalSavingsAfterLoan?.toLocaleString('en-IN')}/mo after)`);
    passed++;
  } else {
    fail("Loan projection incorrect", {year: 10, additional: 20000}, {year: result3.loanEndYear, additional: result3.additionalSavingsAfterLoan});
  }
  
  return testResult(passed, total);
}

// Test 3: SIP Calculation Tests
function testSIPCalculations() {
  section("TEST 3: SIP Calculations");
  let passed = 0;
  const total = 5;
  
  // Test 3a: Minimum ₹5K SIP when savings >= ₹5K
  const plan1 = createTestPlan({
    monthlyIncome: 100000,
    savingsRate: 30,
    totalAssets: 10000000, // ₹1Cr - already covers retirement
  });
  const result1 = calculateRetirementPlan(plan1);
  if (result1.sipAmount >= 5000) {
    pass(`Minimum ₹5K SIP enforced when savings adequate (₹${result1.sipAmount.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("Minimum ₹5K SIP not enforced", "≥5000", result1.sipAmount);
  }
  
  // Test 3b: Affordability-based SIP when savings < ₹5K
  const plan2 = createTestPlan({
    monthlyIncome: 20000,
    savingsRate: 15, // Only ₹3K savings
    totalAssets: 1000000, // Assets cover retirement
  });
  const result2 = calculateRetirementPlan(plan2);
  const maxAffordable = 20000 * 0.15;
  if (result2.sipAmount > 0 && result2.sipAmount <= maxAffordable) {
    pass(`Affordability-based SIP for low savings (₹${result2.sipAmount.toLocaleString('en-IN')} ≤ ₹${maxAffordable.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("Affordability-based SIP incorrect", `0 < sip ≤ ${maxAffordable}`, result2.sipAmount);
  }
  
  // Test 3c: Zero SIP when savings is zero/negative
  const plan3 = createTestPlan({
    monthlyIncome: 50000,
    savingsRate: 0,
  });
  const result3 = calculateRetirementPlan(plan3);
  if (result3.sipAmount === 0) {
    pass("Zero SIP when savings is zero");
    passed++;
  } else {
    fail("Zero savings should result in zero SIP", 0, result3.sipAmount);
  }
  
  // Test 3d: Gap-based SIP calculation
  const plan4 = createTestPlan({
    monthlyIncome: 100000,
    savingsRate: 20,
    totalAssets: 0, // No assets - needs full corpus from SIP
  });
  const result4 = calculateRetirementPlan(plan4);
  if (result4.sipAmount >= 5000 && result4.sipAmount <= 24000) { // Should be within savings capacity
    pass(`Gap-based SIP within savings capacity (₹${result4.sipAmount.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("Gap-based SIP out of range", "5000-24000", result4.sipAmount);
  }
  
  // Test 3e: SIP projection value should be positive
  const plan5 = createTestPlan({});
  const result5 = calculateRetirementPlan(plan5);
  if (result5.projectedSipValue > 0) {
    pass(`SIP projection value positive (₹${(result5.projectedSipValue / 10000000).toFixed(2)}Cr)`);
    passed++;
  } else {
    fail("SIP projection value should be positive", ">0", result5.projectedSipValue);
  }
  
  return testResult(passed, total);
}

// Test 4: Corpus Calculation Tests
function testCorpusCalculations() {
  section("TEST 4: Corpus Calculations");
  let passed = 0;
  const total = 4;
  
  // Test 4a: Corpus increases with longer retirement duration
  const plan1a = createTestPlan({ retirementAge: 60, currentAge: 30 }); // 30 years to retirement
  const plan1b = createTestPlan({ retirementAge: 65, currentAge: 30 }); // 35 years to retirement
  const result1a = calculateRetirementPlan(plan1a);
  const result1b = calculateRetirementPlan(plan1b);
  if (result1b.totalCorpusNeeded > result1a.totalCorpusNeeded) {
    pass(`Corpus increases with later retirement (₹${(result1a.totalCorpusNeeded/10000000).toFixed(2)}Cr @ 60 → ₹${(result1b.totalCorpusNeeded/10000000).toFixed(2)}Cr @ 65)`);
    passed++;
  } else {
    fail("Corpus should increase with later retirement");
  }
  
  // Test 4b: 12% buffer is applied
  const plan2 = createTestPlan({});
  const result2 = calculateRetirementPlan(plan2);
  const bufferRatio = result2.bufferAmount / result2.baseCorpusNeeded;
  if (Math.abs(bufferRatio - 0.12) < 0.01) {
    pass(`12% corpus buffer correctly applied (₹${(result2.bufferAmount/10000000).toFixed(2)}Cr buffer)`);
    passed++;
  } else {
    fail("12% corpus buffer incorrect", "0.12", bufferRatio.toFixed(3));
  }
  
  // Test 4c: Corpus with luxury lifestyle > comfortable
  const plan3a = createTestPlan({ lifestyleChoice: "comfortable", replacementRatio: 90 });
  const plan3b = createTestPlan({ lifestyleChoice: "luxury", replacementRatio: 120 });
  const result3a = calculateRetirementPlan(plan3a);
  const result3b = calculateRetirementPlan(plan3b);
  if (result3b.totalCorpusNeeded > result3a.totalCorpusNeeded) {
    pass(`Luxury lifestyle requires more corpus (₹${(result3a.totalCorpusNeeded/10000000).toFixed(2)}Cr → ₹${(result3b.totalCorpusNeeded/10000000).toFixed(2)}Cr)`);
    passed++;
  } else {
    fail("Luxury corpus should exceed comfortable corpus");
  }
  
  // Test 4d: Asset projection with returns
  const plan4 = createTestPlan({
    totalAssets: 1000000,
    currentAge: 30,
    retirementAge: 60,
  });
  const result4 = calculateRetirementPlan(plan4);
  if (result4.projectedAssetValue > result4.totalAssets * 5) { // Should at least 5x over 30 years
    pass(`Assets project with returns (₹${(result4.totalAssets/100000).toFixed(1)}L → ₹${(result4.projectedAssetValue/10000000).toFixed(2)}Cr)`);
    passed++;
  } else {
    fail("Asset projection seems too low", `>${result4.totalAssets * 5}`, result4.projectedAssetValue);
  }
  
  return testResult(passed, total);
}

// Test 5: Tax Calculation Tests
function testTaxCalculations() {
  section("TEST 5: Tax Calculations (New Regime FY 2024-25)");
  let passed = 0;
  const total = 5;
  
  // Test 5a: Income ≤ ₹7L should pay zero tax (Section 87A rebate)
  const plan1 = createTestPlan({ monthlyIncome: 50000 }); // ₹6L annual
  const result1 = calculateRetirementPlan(plan1);
  if (result1.annualTax === 0) {
    pass("Zero tax for ₹6L annual income (Section 87A rebate)");
    passed++;
  } else {
    fail("Tax should be zero for income ≤ ₹7L", 0, result1.annualTax);
  }
  
  // Test 5b: ₹50K standard deduction applied (FY 2024-25)
  const plan2 = createTestPlan({ monthlyIncome: 75000 }); // ₹9L annual
  const result2 = calculateRetirementPlan(plan2);
  // (9L - 50K standard = 8.5L taxable) → (4-8L: 20K) + (8-8.5L: 2.5K) = 22,500 + 4% cess = 23,400
  if (result2.annualTax > 22000 && result2.annualTax < 25000) {
    pass(`₹50K standard deduction applied with FY24-25 slabs (₹9L income → ₹${result2.annualTax.toLocaleString('en-IN')} tax)`);
    passed++;
  } else {
    fail("Standard deduction calculation incorrect", "22000-25000", result2.annualTax);
  }
  
  // Test 5c: 4% health & education cess applied
  const plan3 = createTestPlan({ monthlyIncome: 100000 }); // ₹12L annual
  const result3 = calculateRetirementPlan(plan3);
  // (12L - 50K = 11.5L taxable) → (4-8L: 20K) + (8-11.5L: 35K) = 55,000 + 4% cess = 57,200
  if (result3.annualTax > 55000 && result3.annualTax < 60000) {
    pass(`4% cess applied on ₹12L income (₹${result3.annualTax.toLocaleString('en-IN')} tax)`);
    passed++;
  } else {
    fail("Cess calculation seems incorrect", "55000-60000", result3.annualTax);
  }
  
  // Test 5d: Progressive tax slabs
  const plan4a = createTestPlan({ monthlyIncome: 60000 }); // ₹7.2L
  const plan4b = createTestPlan({ monthlyIncome: 90000 }); // ₹10.8L
  const result4a = calculateRetirementPlan(plan4a);
  const result4b = calculateRetirementPlan(plan4b);
  // ₹7.2L should be rebated (below ₹7L after deduction), ₹10.8L should have tax
  if (result4a.annualTax === 0 && result4b.annualTax > 30000) {
    pass(`Progressive slabs work (₹7.2L: ₹${result4a.annualTax.toLocaleString('en-IN')} → ₹10.8L: ₹${result4b.annualTax.toLocaleString('en-IN')})`);
    passed++;
  } else {
    fail("Progressive tax slabs not working correctly", "0 and >30000", `${result4a.annualTax} and ${result4b.annualTax}`);
  }
  
  // Test 5e: Savings are calculated post-tax
  const plan5 = createTestPlan({
    monthlyIncome: 100000,
    savingsRate: 20,
  });
  const result5 = calculateRetirementPlan(plan5);
  const expectedSavings = 100000 * 0.20;
  if (result5.monthlySavings > expectedSavings * 0.8) { // Should be close to 20% despite tax
    pass(`Savings rate preserved despite taxes (₹${result5.monthlySavings.toLocaleString('en-IN')}/mo)`);
    passed++;
  } else {
    fail("Savings calculation post-tax incorrect");
  }
  
  return testResult(passed, total);
}

// Test 6: Freedom Score Calculation
function testFreedomScore() {
  section("TEST 6: Freedom Score Calculation");
  let passed = 0;
  const total = 4;
  
  // Test 6a: High assets = high Freedom Score
  const result1 = calculateFreedomScore({
    currentAge: 30,
    retirementAge: 60,
    monthlyIncome: 100000,
    savingsRate: 30,
    totalAssets: 10000000, // ₹1Cr existing
    postRetirementMonthlyExpense: 60000,
    longevityYears: 25,
    riskScore: 3,
  });
  if (result1 >= 80) {
    pass(`High assets yield high Freedom Score (${result1}/100)`);
    passed++;
  } else {
    fail("High assets should yield Freedom Score ≥ 80", "≥80", result1);
  }
  
  // Test 6b: Low savings = lower Freedom Score
  const result2 = calculateFreedomScore({
    currentAge: 30,
    retirementAge: 60,
    monthlyIncome: 100000,
    savingsRate: 5, // Only 5%
    totalAssets: 0,
    postRetirementMonthlyExpense: 60000,
    longevityYears: 25,
    riskScore: 3,
  });
  if (result2 < 50) {
    pass(`Low savings yield low Freedom Score (${result2}/100)`);
    passed++;
  } else {
    fail("Low savings should yield Freedom Score < 50", "<50", result2);
  }
  
  // Test 6c: Risk score affects returns assumption
  const riskScore1 = calculateRiskScore("sleep_fine", 70); // Aggressive
  const riskScore2 = calculateRiskScore("panic", 30); // Conservative
  if (riskScore1 >= 4 && riskScore2 <= 2) {
    pass(`Risk scoring works (sleep_fine+growth: ${riskScore1}, panic+income: ${riskScore2})`);
    passed++;
  } else {
    fail("Risk score calculation incorrect");
  }
  
  // Test 6d: Freedom Score caps at 100
  const result4 = calculateFreedomScore({
    currentAge: 30,
    retirementAge: 60,
    monthlyIncome: 200000,
    savingsRate: 50,
    totalAssets: 50000000, // ₹5Cr
    postRetirementMonthlyExpense: 60000,
    longevityYears: 25,
    riskScore: 5,
  });
  if (result4 === 100) {
    pass("Freedom Score correctly caps at 100");
    passed++;
  } else {
    fail("Freedom Score should cap at 100", 100, result4);
  }
  
  return testResult(passed, total);
}

// Run all tests
export function runDebugTests() {
  console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║  SNOWBALL CALCULATION DEBUG TEST SUITE        ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const results = [
    testExpenseCalculations(),
    testEMIHandling(),
    testSIPCalculations(),
    testCorpusCalculations(),
    testTaxCalculations(),
    testFreedomScore(),
  ];
  
  const allPassed = results.every(r => r);
  
  section("FINAL SUMMARY");
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED! Calculations are accurate.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}${colors.bold}❌ SOME TESTS FAILED. Review the failures above.${colors.reset}\n`);
  }
  
  return allPassed;
}

// Execute tests if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDebugTests();
}
