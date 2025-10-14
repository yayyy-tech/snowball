import { type User, type InsertUser, type UpsertUser, type RetirementPlan, type InsertRetirementPlan, users, retirementPlans } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  
  createRetirementPlan(plan: InsertRetirementPlan): Promise<RetirementPlan>;
  getRetirementPlan(id: string): Promise<RetirementPlan | undefined>;
  updateRetirementPlan(id: string, plan: Partial<InsertRetirementPlan>): Promise<RetirementPlan | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createRetirementPlan(plan: InsertRetirementPlan): Promise<RetirementPlan> {
    const result = await db.insert(retirementPlans).values(plan).returning();
    return result[0];
  }

  async getRetirementPlan(id: string): Promise<RetirementPlan | undefined> {
    const result = await db.select().from(retirementPlans).where(eq(retirementPlans.id, id)).limit(1);
    return result[0];
  }

  async updateRetirementPlan(id: string, plan: Partial<InsertRetirementPlan>): Promise<RetirementPlan | undefined> {
    const result = await db.update(retirementPlans).set(plan).where(eq(retirementPlans.id, id)).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
