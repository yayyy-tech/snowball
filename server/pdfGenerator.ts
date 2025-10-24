import { jsPDF } from 'jspdf';
import type { RetirementPlan, CalculatedPlan } from '@shared/schema';

// Compounding wisdom quotes from Buffett, Munger, and Morgan Housel
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
    text: "The iron rule of nature is: you get what you reward for. If you want ants to come, you put sugar on the floor.",
    author: "Charlie Munger"
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

export function generateRetirementPDF(plan: RetirementPlan): Buffer {
  const calc = plan.calculatedPlan as CalculatedPlan;
  const userName = plan.fullName || 'User';
  const quote = getRandomQuote();
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, color?: string) => {
    doc.setFontSize(fontSize);
    if (color) {
      const [r, g, b] = color.split(',').map(Number);
      doc.setTextColor(r, g, b);
    } else {
      doc.setTextColor(60, 60, 60);
    }
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Header with green accent
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Title
  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129);
  yPos = 25;
  doc.text('Your Snowball Retirement Blueprint', margin, yPos);

  // Watermark
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('Made with Snowball', pageWidth - margin - 35, yPos);

  // User name
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(`Prepared for: ${userName}`, margin, yPos);

  // Date
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, yPos);

  // Section divider
  yPos += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Retirement Goal Summary
  yPos += 12;
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text('Retirement Goal Summary', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const summaryItems = [
    { label: 'Current Age', value: `${plan.currentAge} years` },
    { label: 'Retirement Age', value: `${plan.retirementAge} years` },
    { label: 'Years to Retirement', value: `${calc.yearsToRetirement} years` },
    { label: 'Target Retirement Corpus', value: formatIndianCurrency(calc.totalCorpusNeeded) },
    { label: 'Current Assets', value: formatIndianCurrency(calc.totalAssets) },
    { label: 'Projected Asset Value', value: formatIndianCurrency(calc.projectedAssetValue) },
  ];

  summaryItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, margin + 80, yPos);
    yPos += 7;
  });

  // Investment Strategy
  yPos += 8;
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text('Investment Strategy', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const strategyItems = [
    { label: 'Recommended Monthly SIP', value: formatIndianCurrency(calc.sipAmount) },
    { label: 'Annual Step-Up Rate', value: '7%' },
    { label: 'Projected SIP Value', value: formatIndianCurrency(calc.projectedSipValue) },
    { label: 'Total Corpus at Retirement', value: formatIndianCurrency(calc.projectedAssetValue + calc.projectedSipValue) },
  ];

  strategyItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, margin + 80, yPos);
    yPos += 7;
  });

  // Asset Allocation
  yPos += 8;
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text('Asset Allocation', margin, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const allocationItems = [
    { label: 'Equity', value: `${calc.assetAllocation.equity}%`, color: [59, 130, 246] },
    { label: 'Debt', value: `${calc.assetAllocation.debt}%`, color: [139, 92, 246] },
    { label: 'Gold', value: `${calc.assetAllocation.gold}%`, color: [234, 179, 8] },
  ];

  allocationItems.forEach((item) => {
    // Color box
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(margin + 5, yPos - 3, 4, 4, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, margin + 12, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, margin + 40, yPos);
    yPos += 7;
  });

  // Freedom Score
  yPos += 8;
  doc.setFillColor(240, 253, 244); // green-50
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 3, 3, 'F');
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text(`Freedom Score: ${calc.freedomScore}/100`, margin + 5, yPos);
  yPos += 7;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('A measure of your progress towards financial independence', margin + 5, yPos);

  // Compounding Wisdom (Quote)
  yPos += 18;
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text('Compounding Wisdom', margin, yPos);

  yPos += 10;
  doc.setFillColor(249, 250, 251); // gray-50
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 32, 3, 3, 'F');
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'italic');
  yPos = addWrappedText(`"${quote.text}"`, margin + 5, yPos, pageWidth - 2 * margin - 10, 11);
  
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`— ${quote.author}`, margin + 5, yPos);

  // Snowball Note
  yPos += 20;
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 3, 3, 'F');
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Snowball Note', margin + 5, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos = addWrappedText(
    'Remember: Compounding rewards patience. Stick to your plan — and let time do its job.',
    margin + 5,
    yPos,
    pageWidth - 2 * margin - 10,
    10,
    '255,255,255'
  );

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('This is educational guidance only and not regulated investment advice.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Verify instrument availability & suitability before investing.', pageWidth / 2, footerY + 4, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}
