import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRetirementPlanSchema, insertOneTimeExpenseSchema } from "@shared/schema";
import { calculateRetirementPlan } from "./calculations";
import { generateFundRecommendations, generateCompleteRecommendations, type RecommendationInput } from "./fundRecommendations";
import { setupAuth, isAuthenticated, optionalAuth } from "./replitAuth";
import { generateGPTRecommendations } from "./gptRecommendations";
import { generateRetirementPDF } from "./pdfGenerator";
import { callClaudeWithRetry } from "./utils/claude";
import { WebSocketServer } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (Google login, GitHub, etc.)
  await setupAuth(app);

  // Auth route - returns logged-in user data
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create a new retirement plan (public - no login required)
  app.post("/api/retirement-plans", async (req: any, res) => {
    try {
      // userId is optional for guest users (no authentication required)
      const userId = req.user?.claims?.sub || null;
      const validatedData = insertRetirementPlanSchema.parse(req.body);
      
      // Associate plan with user if logged in, otherwise create as guest plan
      const plan = await storage.createRetirementPlan({
        ...validatedData,
        userId,
      });
      
      // Fetch one-time expenses for this plan (if any)
      const expenses = await storage.getOneTimeExpensesByPlanId(plan.id);
      
      // Calculate retirement plan with expenses
      const calculatedPlan = calculateRetirementPlan(plan, expenses);
      
      // Update plan with calculations
      await storage.updateRetirementPlan(plan.id, {
        calculatedPlan: calculatedPlan,
      });
      
      // Fetch the updated plan with calculations
      const updatedPlan = await storage.getRetirementPlan(plan.id);
      
      res.json(updatedPlan);
    } catch (error: any) {
      console.error("Error creating retirement plan:", error);
      res.status(400).json({ error: error.message || "Failed to create retirement plan" });
    }
  });

  // Get a retirement plan by ID (public - no login required)
  app.get("/api/retirement-plans/:id", async (req: any, res) => {
    try {
      const plan = await storage.getRetirementPlan(req.params.id);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Public access - anyone can view any plan by ID
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching retirement plan:", error);
      res.status(500).json({ error: "Failed to fetch retirement plan" });
    }
  });

  // Download retirement plan as PDF (public - no login required)
  app.get("/api/retirement-plans/:id/download-pdf", async (req: any, res) => {
    try {
      const plan = await storage.getRetirementPlan(req.params.id);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Generate PDF
      const pdfBuffer = generateRetirementPDF(plan);
      
      // Create filename with user name or date
      const userName = plan.fullName ? plan.fullName.replace(/\s+/g, '_') : new Date().toISOString().split('T')[0];
      const filename = `Snowball_Retirement_Plan_${userName}.pdf`;
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Update a retirement plan (public - no login required)
  app.put("/api/retirement-plans/:id", async (req: any, res) => {
    try {
      // First check if plan exists
      const existingPlan = await storage.getRetirementPlan(req.params.id);
      if (!existingPlan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Public access - anyone can update any plan by ID
      const validatedData = insertRetirementPlanSchema.partial().parse(req.body);
      
      await storage.updateRetirementPlan(req.params.id, validatedData);
      
      // Fetch the updated plan
      const updatedPlan = await storage.getRetirementPlan(req.params.id);
      
      if (!updatedPlan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Fetch expenses for this plan
      const expenses = await storage.getOneTimeExpensesByPlanId(req.params.id);
      
      // Recalculate if data changed
      const calculatedPlan = calculateRetirementPlan(updatedPlan, expenses);
      
      await storage.updateRetirementPlan(req.params.id, {
        calculatedPlan: calculatedPlan,
      });
      
      // Fetch the final plan with calculations
      const finalPlan = await storage.getRetirementPlan(req.params.id);
      
      res.json(finalPlan);
    } catch (error: any) {
      console.error("Error updating retirement plan:", error);
      res.status(400).json({ error: error.message || "Failed to update retirement plan" });
    }
  });

  // Fund Recommendation API endpoints
  app.post("/api/fund-recommendations", async (req, res) => {
    try {
      const { riskAppetite, totalAmount, growthPreference, fundType } = req.body as RecommendationInput;

      if (!riskAppetite || !totalAmount || !growthPreference || !fundType) {
        return res.status(400).json({ error: "Missing required fields: riskAppetite, totalAmount, growthPreference, fundType" });
      }

      if (!["conservative", "moderate", "aggressive"].includes(riskAppetite)) {
        return res.status(400).json({ error: "Invalid riskAppetite. Must be: conservative, moderate, or aggressive" });
      }

      if (!["stable", "balanced", "high_growth"].includes(growthPreference)) {
        return res.status(400).json({ error: "Invalid growthPreference. Must be: stable, balanced, or high_growth" });
      }

      if (!["equity", "debt"].includes(fundType)) {
        return res.status(400).json({ error: "Invalid fundType. Must be: equity or debt" });
      }

      const recommendations = generateFundRecommendations({
        riskAppetite,
        totalAmount: Number(totalAmount),
        growthPreference,
        fundType
      });

      res.json(recommendations);
    } catch (error: any) {
      console.error("Error generating fund recommendations:", error);
      res.status(500).json({ error: error.message || "Failed to generate fund recommendations" });
    }
  });

  // Complete recommendations (both equity and debt)
  app.post("/api/fund-recommendations/complete", async (req, res) => {
    try {
      const { riskAppetite, equityAmount, debtAmount, growthPreference } = req.body;

      if (!riskAppetite || !equityAmount || !debtAmount || !growthPreference) {
        return res.status(400).json({ 
          error: "Missing required fields: riskAppetite, equityAmount, debtAmount, growthPreference" 
        });
      }

      const recommendations = generateCompleteRecommendations(
        riskAppetite,
        Number(equityAmount),
        Number(debtAmount),
        growthPreference
      );

      res.json(recommendations);
    } catch (error: any) {
      console.error("Error generating complete recommendations:", error);
      res.status(500).json({ error: error.message || "Failed to generate complete recommendations" });
    }
  });

  // GPT-powered AI recommendations (public - no login required)
  app.get("/api/gpt-recommendations/:planId", async (req: any, res) => {
    try {
      const plan = await storage.getRetirementPlan(req.params.planId);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Public access - anyone can get recommendations for any plan
      const gptRecommendations = await generateGPTRecommendations(plan);
      
      res.json(gptRecommendations);
    } catch (error: any) {
      console.error("Error generating GPT recommendations:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI recommendations" });
    }
  });

  // ONE-TIME EXPENSES API ROUTES
  
  // Get all expenses for logged-in user
  app.get("/api/expenses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const expenses = await storage.getOneTimeExpensesByUserId(userId);
      res.json(expenses);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  // Get expenses for a specific plan
  app.get("/api/expenses/plan/:planId", optionalAuth, async (req: any, res) => {
    try {
      const expenses = await storage.getOneTimeExpensesByPlanId(req.params.planId);
      res.json(expenses);
    } catch (error: any) {
      console.error("Error fetching plan expenses:", error);
      res.status(500).json({ error: "Failed to fetch plan expenses" });
    }
  });

  // Create a new one-time expense
  app.post("/api/expenses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOneTimeExpenseSchema.parse({
        ...req.body,
        userId,
      });
      
      // Calculate inflation-adjusted cost
      const currentYear = new Date().getFullYear();
      const yearsUntilExpense = (validatedData.targetYear || currentYear) - currentYear;
      const inflationRate = 0.06;
      const inflationAdjustedCost = Math.round(
        validatedData.estimatedCost * Math.pow(1 + inflationRate, yearsUntilExpense)
      );
      
      const expense = await storage.createOneTimeExpense(validatedData);
      
      // Update the expense with inflation-adjusted cost
      await storage.updateOneTimeExpense(expense.id, userId, {
        inflationAdjustedCost,
      });
      
      // If expense is linked to a plan, recalculate the plan
      if (expense.retirementPlanId) {
        const plan = await storage.getRetirementPlan(expense.retirementPlanId);
        if (plan) {
          const expenses = await storage.getOneTimeExpensesByPlanId(expense.retirementPlanId);
          const calculatedPlan = calculateRetirementPlan(plan, expenses);
          await storage.updateRetirementPlan(expense.retirementPlanId, {
            calculatedPlan,
          });
        }
      }
      
      res.json(expense);
    } catch (error: any) {
      console.error("Error creating expense:", error);
      res.status(400).json({ error: error.message || "Failed to create expense" });
    }
  });

  // Update an expense
  app.put("/api/expenses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOneTimeExpenseSchema.partial().parse(req.body);
      
      const expense = await storage.updateOneTimeExpense(req.params.id, userId, validatedData);
      
      // Recalculate inflation-adjusted cost if estimate or year changed
      if (expense && (validatedData.estimatedCost || validatedData.targetYear)) {
        const currentYear = new Date().getFullYear();
        const targetYear = expense.targetYear || currentYear;
        const yearsUntilExpense = targetYear - currentYear;
        const inflationRate = 0.06;
        const cost = expense.estimatedCost;
        const inflationAdjustedCost = Math.round(
          cost * Math.pow(1 + inflationRate, yearsUntilExpense)
        );
        
        await storage.updateOneTimeExpense(req.params.id, userId, {
          inflationAdjustedCost,
        });
      }
      
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      
      // Recalculate plan if needed
      if (expense.retirementPlanId) {
        const plan = await storage.getRetirementPlan(expense.retirementPlanId);
        if (plan) {
          const expenses = await storage.getOneTimeExpensesByPlanId(expense.retirementPlanId);
          const calculatedPlan = calculateRetirementPlan(plan, expenses);
          await storage.updateRetirementPlan(expense.retirementPlanId, {
            calculatedPlan,
          });
        }
      }
      
      res.json(expense);
    } catch (error: any) {
      console.error("Error updating expense:", error);
      res.status(400).json({ error: error.message || "Failed to update expense" });
    }
  });

  // Delete an expense
  app.delete("/api/expenses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get expense first to check plan association
      const expenses = await storage.getOneTimeExpensesByUserId(userId);
      const expense = expenses.find(e => e.id === req.params.id);
      const planId = expense?.retirementPlanId;
      
      await storage.deleteOneTimeExpense(req.params.id, userId);
      
      // Recalculate plan if needed
      if (planId) {
        const plan = await storage.getRetirementPlan(planId);
        if (plan) {
          const expenses = await storage.getOneTimeExpensesByPlanId(planId);
          const calculatedPlan = calculateRetirementPlan(plan, expenses);
          await storage.updateRetirementPlan(planId, {
            calculatedPlan,
          });
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // WHAT IF SIMULATOR API (Claude-powered)
  app.post("/api/what-if", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { question, planId } = req.body;
      
      if (!question || !planId) {
        return res.status(400).json({ error: "Missing question or planId" });
      }
      
      const plan = await storage.getRetirementPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      // Use Claude to interpret the scenario and provide analysis
      const systemPrompt = `You are a retirement planning expert. Analyze "what if" scenarios for Indian users.
You have access to the user's current retirement plan data. Provide detailed, accurate financial projections.
Always use Indian formatting for currency (₹ with lakhs/crores) and consider Indian context (inflation ~6%, returns 9-12%).`;

      const planSummary = `Current Plan:
- Age: ${plan.currentAge}, Retirement Age: ${plan.retirementAge}
- Monthly Income: ₹${plan.monthlyIncome?.toLocaleString('en-IN')}
- Savings Rate: ${plan.savingsRate}%
- Total Assets: ₹${plan.totalAssets?.toLocaleString('en-IN')}
- Lifestyle: ${plan.lifestyleChoice}
- Location: ${plan.retirementLocation}
- Freedom Score: ${(plan.calculatedPlan as any)?.freedomScore || 'N/A'}
- Required Corpus: ₹${((plan.calculatedPlan as any)?.totalCorpusNeeded / 10000000).toFixed(2)}Cr
- Monthly SIP: ₹${(plan.calculatedPlan as any)?.sipAmount?.toLocaleString('en-IN')}`;

      const userMessage = `User asks: "${question}"

Based on the current plan, provide:
1. Brief interpretation of what they're asking
2. Numerical impact (corpus needed, SIP changes, retirement age shift)
3. A clear recommendation
4. Use bullet points and keep it concise but insightful

Format your response in markdown.`;

      const response = await callClaudeWithRetry([
        { role: 'user', content: `${planSummary}\n\n${userMessage}` }
      ], {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 1500,
      });
      
      res.json({ analysis: response, question });
    } catch (error: any) {
      console.error("Error in what-if simulator:", error);
      res.status(500).json({ error: "Failed to analyze scenario" });
    }
  });

  // CHATBOT API (Claude-powered)
  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, planId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Save user message
      await storage.createChatMessage(userId, 'user', message);
      
      // Get recent chat history
      const recentMessages = await storage.getChatMessagesByUserId(userId, 10);
      const chatHistory = recentMessages.reverse().slice(-10); // Last 5 exchanges
      
      // Get user's plan if provided
      let planContext = '';
      if (planId) {
        const plan = await storage.getRetirementPlan(planId);
        if (plan && (plan.userId === userId || !plan.userId)) {
          planContext = `User's Retirement Plan:
- Age: ${plan.currentAge}, Retirement: ${plan.retirementAge}
- Income: ₹${plan.monthlyIncome?.toLocaleString('en-IN')}/month
- Savings: ${plan.savingsRate}%
- Assets: ₹${plan.totalAssets?.toLocaleString('en-IN')}
- Freedom Score: ${(plan.calculatedPlan as any)?.freedomScore || 'Not calculated'}
- SIP: ₹${(plan.calculatedPlan as any)?.sipAmount?.toLocaleString('en-IN')}/month`;
        }
      }
      
      const systemPrompt = `You are Snowball's AI retirement assistant. You help Indian users (age 25-40) understand their retirement plans.

Be:
- Warm, encouraging, and practical
- Use simple language (no jargon unless explaining it)
- Give specific, actionable advice
- Use Indian context (₹, inflation ~6%, corpus in Cr/L)
- Keep responses concise (2-3 short paragraphs max)

You can:
- Explain calculations and concepts
- Suggest SIP increases or lifestyle adjustments
- Give nudges about compounding, patience, consistency
- Answer "how" and "why" questions about their plan

${planContext}`;

      const claudeMessages = chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      
      const response = await callClaudeWithRetry(claudeMessages, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 500,
      });
      
      // Save assistant response
      await storage.createChatMessage(userId, 'assistant', response);
      
      res.json({ response });
    } catch (error: any) {
      console.error("Error in chatbot:", error);
      res.status(500).json({ error: "Failed to get response from assistant" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getChatMessagesByUserId(userId, limit);
      res.json(messages.reverse());
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
