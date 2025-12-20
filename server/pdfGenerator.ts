import { jsPDF } from 'jspdf';
import type { RetirementPlan, CalculatedPlan } from '@shared/schema';

const QUOTES = [
  {
    text: "Someone is sitting in the shade today because someone planted a tree a long time ago.",
    author: "Warren Buffett"
  },
  {
    text: "The first rule of compounding: Never interrupt it unnecessarily.",
    author: "Charlie Munger"
  },
  {
    text: "The big takeaway from history is that the real money is made in waiting, not in trading.",
    author: "Morgan Housel"
  },
  {
    text: "Our favorite holding period is forever.",
    author: "Warren Buffett"
  },
  {
    text: "Good investing is about earning pretty good returns that you can stick with for a long period of time.",
    author: "Morgan Housel"
  },
  {
    text: "Time is the friend of the wonderful company, the enemy of the mediocre.",
    author: "Warren Buffett"
  },
  {
    text: "Patience is the ultimate competitive advantage.",
    author: "Morgan Housel"
  }
];

const COLORS = {
  background: { r: 15, g: 17, b: 23 },
  backgroundLight: { r: 26, g: 29, b: 46 },
  cardBackground: { r: 30, g: 34, b: 56 },
  primary: { r: 91, g: 126, b: 229 },
  success: { r: 74, g: 222, b: 128 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 239, g: 68, b: 68 },
  textPrimary: { r: 255, g: 255, b: 255 },
  textSecondary: { r: 156, g: 163, b: 175 },
  textMuted: { r: 107, g: 114, b: 128 },
  accent: { r: 16, g: 185, b: 129 },
  border: { r: 55, g: 65, b: 81 }
};

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function formatIndianCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

function formatLargeCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Crore`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

function setColor(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setTextColor(color.r, color.g, color.b);
}

function setFillColor(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setFillColor(color.r, color.g, color.b);
}

function drawDarkBackground(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  setFillColor(doc, COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
}

function drawCard(doc: jsPDF, x: number, y: number, width: number, height: number, radius: number = 4) {
  setFillColor(doc, COLORS.cardBackground);
  doc.roundedRect(x, y, width, height, radius, radius, 'F');
}

function drawProgressRing(doc: jsPDF, centerX: number, centerY: number, radius: number, percentage: number) {
  const startAngle = -90;
  const endAngle = startAngle + (percentage / 100) * 360;
  
  doc.setDrawColor(COLORS.border.r, COLORS.border.g, COLORS.border.b);
  doc.setLineWidth(3);
  doc.circle(centerX, centerY, radius, 'S');
  
  if (percentage > 0) {
    const color = percentage >= 80 ? COLORS.success : percentage >= 60 ? COLORS.primary : COLORS.warning;
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(4);
    
    const steps = Math.ceil(percentage / 5);
    for (let i = 0; i <= steps; i++) {
      const angle = (startAngle + (i / steps) * (endAngle - startAngle)) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        doc.circle(x, y, 0.5, 'F');
      } else {
        const prevAngle = (startAngle + ((i - 1) / steps) * (endAngle - startAngle)) * (Math.PI / 180);
        const prevX = centerX + radius * Math.cos(prevAngle);
        const prevY = centerY + radius * Math.sin(prevAngle);
        doc.line(prevX, prevY, x, y);
      }
    }
  }
}

function addPageNumber(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  setColor(doc, COLORS.textMuted);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
}

function addFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(7);
  setColor(doc, COLORS.textMuted);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, pageHeight - 15);
  doc.text('This is educational guidance only and not regulated investment advice.', pageWidth / 2, pageHeight - 15, { align: 'center' });
}

export function generateRetirementPDF(plan: RetirementPlan): Buffer {
  const calc = plan.calculatedPlan as CalculatedPlan;
  const userName = plan.fullName || 'User';
  const quote = getRandomQuote();
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  
  const totalPages = 4;
  let currentPage = 1;

  // ==================== PAGE 1: HEADER & FREEDOM SCORE ====================
  drawDarkBackground(doc);
  let yPos = margin;

  // Top accent bar
  setFillColor(doc, COLORS.accent);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Logo text
  yPos = 18;
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.accent);
  doc.text('Snowball', margin, yPos);
  
  doc.setFontSize(9);
  setColor(doc, COLORS.textMuted);
  doc.text('Your Retirement Planner', margin + 42, yPos);

  // Personalized greeting
  yPos += 18;
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text(`Hi, ${userName}!`, margin, yPos);

  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textSecondary);
  doc.text("Here's your personalized retirement roadmap", margin, yPos);

  // Freedom Score Section
  yPos += 18;
  drawCard(doc, margin, yPos, contentWidth, 65);
  
  const scoreBoxY = yPos + 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textSecondary);
  doc.text('YOUR FREEDOM SCORE', margin + 10, scoreBoxY);

  // Large score display
  doc.setFontSize(52);
  doc.setFont('helvetica', 'bold');
  const scoreColor = calc.freedomScore >= 80 ? COLORS.success : calc.freedomScore >= 60 ? COLORS.primary : COLORS.warning;
  setColor(doc, scoreColor);
  doc.text(`${calc.freedomScore}`, margin + 10, scoreBoxY + 35);
  
  doc.setFontSize(24);
  setColor(doc, COLORS.textMuted);
  doc.text('/100', margin + 45, scoreBoxY + 35);

  // Status message
  const statusText = calc.freedomScore >= 80 ? 'Excellent - On track for freedom!' :
                     calc.freedomScore >= 60 ? 'Good - Small tweaks will help' :
                     'Needs attention - But achievable!';
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  setColor(doc, scoreColor);
  doc.text(statusText, margin + 10, scoreBoxY + 48);

  // Progress ring (simplified representation)
  const ringX = pageWidth - margin - 35;
  const ringY = scoreBoxY + 28;
  drawProgressRing(doc, ringX, ringY, 22, calc.freedomScore);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text(`${calc.freedomScore}`, ringX, ringY + 4, { align: 'center' });

  yPos += 72;

  // Alert box
  drawCard(doc, margin, yPos, contentWidth, 22);
  setFillColor(doc, COLORS.success);
  doc.rect(margin, yPos, 4, 22, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.success);
  doc.text("You're closer than you think!", margin + 12, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textSecondary);
  doc.text('Start today with your recommended SIP and stay consistent for the best results.', margin + 12, yPos + 17);

  yPos += 30;

  // Three key metrics cards
  const cardWidth = (contentWidth - 12) / 3;
  const metrics = [
    { label: 'Years to Retirement', value: `${calc.yearsToRetirement}`, suffix: 'years left' },
    { label: 'Retirement Corpus', value: formatIndianCurrency(calc.totalCorpusNeeded), suffix: 'with 12% buffer' },
    { label: 'Monthly SIP Required', value: formatIndianCurrency(calc.sipAmount), suffix: 'with 7% step-up' }
  ];

  metrics.forEach((metric, i) => {
    const cardX = margin + i * (cardWidth + 6);
    drawCard(doc, cardX, yPos, cardWidth, 42);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textMuted);
    doc.text(metric.label, cardX + 6, yPos + 10);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.textPrimary);
    doc.text(metric.value, cardX + 6, yPos + 26);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textSecondary);
    doc.text(metric.suffix, cardX + 6, yPos + 35);
  });

  yPos += 52;

  // Precision calculation notice
  drawCard(doc, margin, yPos, contentWidth, 20);
  setFillColor(doc, COLORS.warning);
  doc.rect(margin, yPos, 4, 20, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.warning);
  doc.text('Precision Calculation', margin + 12, yPos + 9);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textSecondary);
  doc.text('These numbers account for 6% inflation, your current assets, and your savings capacity.', margin + 12, yPos + 16);

  addFooter(doc);
  addPageNumber(doc, currentPage, totalPages);

  // ==================== PAGE 2: DETAILED CALCULATION BREAKDOWN ====================
  doc.addPage();
  currentPage++;
  drawDarkBackground(doc);
  yPos = margin;

  // Header
  setFillColor(doc, COLORS.accent);
  doc.rect(0, 0, pageWidth, 4, 'F');

  yPos = 18;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Detailed Calculation Breakdown', margin, yPos);

  yPos += 14;
  
  // Two column layout
  const colWidth = (contentWidth - 10) / 2;
  
  // LEFT COLUMN: Accumulation Phase
  drawCard(doc, margin, yPos, colWidth, 95);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.primary);
  doc.text('Accumulation Phase', margin + 8, yPos + 12);
  
  const accumulationData = [
    { label: 'Current Age', value: `${plan.currentAge} years` },
    { label: 'Starting Monthly SIP', value: formatIndianCurrency(calc.sipAmount) },
    { label: 'Annual Step-up', value: '7%' },
    { label: 'Years to Retirement', value: `${calc.yearsToRetirement} years` },
    { label: 'Current Assets', value: formatIndianCurrency(calc.totalAssets) },
    { label: 'Projected Asset Value', value: formatIndianCurrency(calc.projectedAssetValue) },
    { label: 'Annual Tax (estimate)', value: '15%' },
    { label: 'Buffer for Unexpected', value: '12%' }
  ];

  let leftY = yPos + 22;
  accumulationData.forEach((item, i) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textSecondary);
    doc.text(item.label, margin + 8, leftY);
    
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.textPrimary);
    doc.text(item.value, margin + colWidth - 8, leftY, { align: 'right' });
    leftY += 8;
  });

  // Highlighted total
  leftY += 2;
  setFillColor(doc, COLORS.primary);
  doc.roundedRect(margin + 4, leftY - 4, colWidth - 8, 12, 2, 2, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Total Corpus Needed', margin + 8, leftY + 4);
  doc.text(formatIndianCurrency(calc.totalCorpusNeeded), margin + colWidth - 8, leftY + 4, { align: 'right' });

  // RIGHT COLUMN: Withdrawal Phase
  const rightX = margin + colWidth + 10;
  drawCard(doc, rightX, yPos, colWidth, 95);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.success);
  doc.text('Withdrawal Phase', rightX + 8, yPos + 12);

  const retirementYears = (plan.retirementAge || 60) - (plan.currentAge || 30);
  const longevityAge = 85;
  const postRetirementYears = longevityAge - (plan.retirementAge || 60);
  const monthlyExpenseAtRetirement = Math.round((plan.monthlyIncome || 100000) * 0.7 * Math.pow(1.06, retirementYears));
  const monthlySWP = Math.round(monthlyExpenseAtRetirement * 1.1);

  const withdrawalData = [
    { label: 'Retirement Age', value: `${plan.retirementAge} years` },
    { label: 'Post-Retirement Years', value: `${postRetirementYears} years` },
    { label: 'Longevity Age', value: `${longevityAge} years` },
    { label: 'Current Monthly Expense', value: formatIndianCurrency(plan.monthlyIncome ? plan.monthlyIncome * 0.7 : 70000) },
    { label: 'Inflation Rate Used', value: '6%' },
    { label: 'Monthly Expense @ Retirement', value: formatIndianCurrency(monthlyExpenseAtRetirement) }
  ];

  let rightY = yPos + 22;
  withdrawalData.forEach((item) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textSecondary);
    doc.text(item.label, rightX + 8, rightY);
    
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.textPrimary);
    doc.text(item.value, rightX + colWidth - 8, rightY, { align: 'right' });
    rightY += 8;
  });

  // Large SWP display
  rightY += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textSecondary);
  doc.text('Monthly SWP Withdrawal', rightX + 8, rightY);
  
  rightY += 10;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.success);
  doc.text(formatLargeCurrency(monthlySWP), rightX + 8, rightY);

  rightY += 8;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textMuted);
  doc.text('Adjusted for inflation annually', rightX + 8, rightY);

  yPos += 105;

  // Investment Strategy Summary
  drawCard(doc, margin, yPos, contentWidth, 60);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Investment Strategy Summary', margin + 8, yPos + 12);

  const projectedSipValue = calc.projectedSipValue || 0;
  const totalAtRetirement = calc.projectedAssetValue + projectedSipValue;

  const strategyItems = [
    { label: 'Recommended Monthly SIP', value: formatIndianCurrency(calc.sipAmount), highlight: true },
    { label: 'Annual Step-Up Rate', value: '7%' },
    { label: 'Projected SIP Value at Retirement', value: formatIndianCurrency(projectedSipValue) },
    { label: 'Projected Asset Growth', value: formatIndianCurrency(calc.projectedAssetValue) },
    { label: 'Total Corpus at Retirement', value: formatIndianCurrency(totalAtRetirement), highlight: true }
  ];

  let stratY = yPos + 22;
  strategyItems.forEach((item) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    setColor(doc, item.highlight ? COLORS.accent : COLORS.textSecondary);
    doc.text(item.label, margin + 8, stratY);
    
    doc.setFont('helvetica', 'bold');
    setColor(doc, item.highlight ? COLORS.accent : COLORS.textPrimary);
    doc.text(item.value, margin + contentWidth - 8, stratY, { align: 'right' });
    stratY += 9;
  });

  addFooter(doc);
  addPageNumber(doc, currentPage, totalPages);

  // ==================== PAGE 3: ASSET ALLOCATION ====================
  doc.addPage();
  currentPage++;
  drawDarkBackground(doc);
  yPos = margin;

  setFillColor(doc, COLORS.accent);
  doc.rect(0, 0, pageWidth, 4, 'F');

  yPos = 18;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Your Asset Allocation', margin, yPos);

  yPos += 18;

  // Asset allocation visual
  drawCard(doc, margin, yPos, contentWidth, 80);

  const allocations = [
    { label: 'Equity', value: calc.assetAllocation.equity, color: COLORS.primary },
    { label: 'Debt', value: calc.assetAllocation.debt, color: COLORS.success },
    { label: 'Gold', value: calc.assetAllocation.gold, color: COLORS.warning }
  ];

  // Draw donut chart representation (simplified as bars)
  let allocY = yPos + 15;
  
  allocations.forEach((alloc, i) => {
    // Label
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.textPrimary);
    doc.text(alloc.label, margin + 10, allocY + 8);
    
    // Percentage
    doc.setFontSize(16);
    setColor(doc, alloc.color);
    doc.text(`${alloc.value}%`, margin + 45, allocY + 8);

    // Progress bar background
    const barX = margin + 75;
    const barWidth = contentWidth - 90;
    const barHeight = 10;
    
    setFillColor(doc, COLORS.border);
    doc.roundedRect(barX, allocY, barWidth, barHeight, 2, 2, 'F');
    
    // Progress bar fill
    const fillWidth = (alloc.value / 100) * barWidth;
    setFillColor(doc, alloc.color);
    doc.roundedRect(barX, allocY, fillWidth, barHeight, 2, 2, 'F');

    allocY += 20;
  });

  // Risk profile note
  allocY += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  setColor(doc, COLORS.textSecondary);
  doc.text(`Based on your ${plan.riskTolerance || 'moderate'} risk profile and ${calc.yearsToRetirement} years to retirement`, margin + 10, allocY);

  yPos += 88;

  // Allocation rationale
  drawCard(doc, margin, yPos, contentWidth, 50);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Why This Allocation?', margin + 8, yPos + 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textSecondary);
  
  const rationaleText = `With ${calc.yearsToRetirement} years until retirement, you have time for equity to grow while managing risk. ` +
    `Equity at ${calc.assetAllocation.equity}% provides growth potential. ` +
    `Debt at ${calc.assetAllocation.debt}% offers stability and regular income. ` +
    `Gold at ${calc.assetAllocation.gold}% acts as a hedge against inflation and market volatility.`;
  
  const lines = doc.splitTextToSize(rationaleText, contentWidth - 16);
  doc.text(lines, margin + 8, yPos + 24);

  yPos += 58;

  // Compounding Wisdom Quote
  drawCard(doc, margin, yPos, contentWidth, 45);
  setFillColor(doc, COLORS.accent);
  doc.rect(margin, yPos, 4, 45, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.accent);
  doc.text('Compounding Wisdom', margin + 12, yPos + 12);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  setColor(doc, COLORS.textPrimary);
  const quoteLines = doc.splitTextToSize(`"${quote.text}"`, contentWidth - 24);
  doc.text(quoteLines, margin + 12, yPos + 24);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textSecondary);
  doc.text(`— ${quote.author}`, margin + 12, yPos + 38);

  addFooter(doc);
  addPageNumber(doc, currentPage, totalPages);

  // ==================== PAGE 4: SIP & INVESTMENTS ====================
  doc.addPage();
  currentPage++;
  drawDarkBackground(doc);
  yPos = margin;

  setFillColor(doc, COLORS.accent);
  doc.rect(0, 0, pageWidth, 4, 'F');

  yPos = 18;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Recommended Monthly SIP', margin, yPos);

  yPos += 16;

  // Large SIP display
  drawCard(doc, margin, yPos, contentWidth, 55);
  
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.success);
  doc.text(formatLargeCurrency(calc.sipAmount), margin + 15, yPos + 30);
  
  doc.setFontSize(14);
  setColor(doc, COLORS.textSecondary);
  doc.text('/month', margin + 100, yPos + 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textMuted);
  doc.text(`Starting today • ${calc.yearsToRetirement} years to retirement • 7% annual step-up`, margin + 15, yPos + 45);

  yPos += 65;

  // Investment Recommendations
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.textPrimary);
  doc.text('Recommended Investments', margin, yPos);

  yPos += 10;

  // Get investment recommendations
  const recommendations = calc.investmentRecommendations || [];
  
  recommendations.forEach((category: any) => {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      drawDarkBackground(doc);
      setFillColor(doc, COLORS.accent);
      doc.rect(0, 0, pageWidth, 4, 'F');
      yPos = 20;
    }

    // Category header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const catColor = category.category.includes('Equity') ? COLORS.primary :
                     category.category.includes('Debt') ? COLORS.success : COLORS.warning;
    setColor(doc, catColor);
    doc.text(category.category, margin, yPos);
    yPos += 8;

    // Instruments
    (category.instruments || []).slice(0, 3).forEach((fund: any) => {
      if (yPos > pageHeight - 35) return;
      
      drawCard(doc, margin, yPos, contentWidth, 28);
      
      // Fund name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      setColor(doc, COLORS.textPrimary);
      doc.text(fund.name || 'Fund', margin + 6, yPos + 10);
      
      // Type and Risk
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      setColor(doc, COLORS.textMuted);
      doc.text(`${fund.type || ''} • ${fund.risk || 'Medium'} Risk`, margin + 6, yPos + 18);
      
      // Allocation
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      setColor(doc, COLORS.success);
      doc.text(`${fund.allocation || 0}%`, margin + contentWidth - 40, yPos + 12, { align: 'right' });
      
      doc.setFontSize(7);
      setColor(doc, COLORS.textMuted);
      doc.text('allocation', margin + contentWidth - 40, yPos + 20, { align: 'right' });

      // Returns
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      setColor(doc, COLORS.textSecondary);
      doc.text(fund.returns || '', margin + contentWidth - 8, yPos + 14, { align: 'right' });

      yPos += 32;
    });

    yPos += 5;
  });

  // Final note
  if (yPos < pageHeight - 40) {
    yPos += 5;
    drawCard(doc, margin, yPos, contentWidth, 28);
    setFillColor(doc, COLORS.accent);
    doc.rect(margin, yPos, 4, 28, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.accent);
    doc.text('Remember', margin + 12, yPos + 10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textSecondary);
    doc.text('Compounding rewards patience. Stick to your plan — and let time do its job.', margin + 12, yPos + 20);
  }

  addFooter(doc);
  addPageNumber(doc, currentPage, totalPages);

  return Buffer.from(doc.output('arraybuffer'));
}
