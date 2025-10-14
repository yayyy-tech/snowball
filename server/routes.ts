import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRetirementPlanSchema } from "@shared/schema";
import { calculateRetirementPlan } from "./calculations";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new retirement plan
  app.post("/api/retirement-plans", async (req, res) => {
    try {
      const validatedData = insertRetirementPlanSchema.parse(req.body);
      
      const plan = await storage.createRetirementPlan(validatedData);
      
      // Calculate retirement plan
      const calculatedPlan = calculateRetirementPlan(plan);
      
      // Update plan with calculations
      await storage.updateRetirementPlan(plan.id, {
        calculatedPlan: calculatedPlan as any,
      });
      
      // Fetch the updated plan with calculations
      const updatedPlan = await storage.getRetirementPlan(plan.id);
      
      res.json(updatedPlan);
    } catch (error: any) {
      console.error("Error creating retirement plan:", error);
      res.status(400).json({ error: error.message || "Failed to create retirement plan" });
    }
  });

  // Get a retirement plan by ID
  app.get("/api/retirement-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getRetirementPlan(req.params.id);
      
      if (!plan) {
        return res.status(404).json({ error: "Retirement plan not found" });
      }
      
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching retirement plan:", error);
      res.status(500).json({ error: "Failed to fetch retirement plan" });
    }
  });

  // Update a retirement plan
  app.put("/api/retirement-plans/:id", async (req, res) => {
    try {
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
        calculatedPlan: calculatedPlan as any,
      });
      
      // Fetch the final plan with calculations
      const finalPlan = await storage.getRetirementPlan(req.params.id);
      
      res.json(finalPlan);
    } catch (error: any) {
      console.error("Error updating retirement plan:", error);
      res.status(400).json({ error: error.message || "Failed to update retirement plan" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
