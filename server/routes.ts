import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRetirementPlanSchema } from "@shared/schema";
import { calculateRetirementPlan } from "./calculations";
import { generateFundRecommendations, generateCompleteRecommendations, type RecommendationInput } from "./fundRecommendations";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateGPTRecommendations } from "./gptRecommendations";

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

  // Create a new retirement plan (protected - requires login)
  app.post("/api/retirement-plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRetirementPlanSchema.parse(req.body);
      
      // Associate plan with logged-in user
      const plan = await storage.createRetirementPlan({
        ...validatedData,
        userId,
      });
      
      // Calculate retirement plan
      const calculatedPlan = calculateRetirementPlan(plan);
      
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

  // Get a retirement plan by ID (protected - must be owner)
  app.get("/api/retirement-plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plan = await storage.getRetirementPlan(req.params.id);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Ensure user can only access their own plan
      if (plan.userId !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only access your own retirement plans" });
      }
      
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching retirement plan:", error);
      res.status(500).json({ error: "Failed to fetch retirement plan" });
    }
  });

  // Update a retirement plan (protected - must be owner)
  app.put("/api/retirement-plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // First check if plan exists and user owns it
      const existingPlan = await storage.getRetirementPlan(req.params.id);
      if (!existingPlan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      if (existingPlan.userId !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only update your own retirement plans" });
      }
      
      const validatedData = insertRetirementPlanSchema.partial().parse(req.body);
      
      await storage.updateRetirementPlan(req.params.id, validatedData);
      
      // Fetch the updated plan
      const updatedPlan = await storage.getRetirementPlan(req.params.id);
      
      if (!updatedPlan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Recalculate if data changed
      const calculatedPlan = calculateRetirementPlan(updatedPlan);
      
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

  // GPT-powered AI recommendations (protected - must own plan)
  app.get("/api/gpt-recommendations/:planId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plan = await storage.getRetirementPlan(req.params.planId);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      // Ensure user can only get recommendations for their own plan
      if (plan.userId !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only access your own retirement plans" });
      }
      
      const gptRecommendations = await generateGPTRecommendations(plan);
      
      res.json(gptRecommendations);
    } catch (error: any) {
      console.error("Error generating GPT recommendations:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI recommendations" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
