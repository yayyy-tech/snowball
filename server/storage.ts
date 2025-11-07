import { 
  type User, 
  type InsertUser, 
  type UpsertUser, 
  type RetirementPlan, 
  type InsertRetirementPlan,
  type OneTimeExpense,
  type InsertOneTimeExpense,
  type ChatMessage,
  users, 
  retirementPlans,
  oneTimeExpenses,
  chatMessages,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  
  // Retirement plan operations
  createRetirementPlan(plan: InsertRetirementPlan): Promise<RetirementPlan>;
  getRetirementPlan(id: string): Promise<RetirementPlan | undefined>;
  getRetirementPlansByUserId(userId: string): Promise<RetirementPlan[]>;
  updateRetirementPlan(id: string, plan: Partial<InsertRetirementPlan>): Promise<RetirementPlan | undefined>;
  
  // One-time expenses operations
  createOneTimeExpense(expense: InsertOneTimeExpense): Promise<OneTimeExpense>;
  getOneTimeExpensesByUserId(userId: string): Promise<OneTimeExpense[]>;
  getOneTimeExpensesByPlanId(planId: string): Promise<OneTimeExpense[]>;
  deleteOneTimeExpense(id: string, userId: string): Promise<void>;
  updateOneTimeExpense(id: string, userId: string, data: Partial<InsertOneTimeExpense>): Promise<OneTimeExpense | undefined>;
  
  // Chat operations
  createChatMessage(userId: string, role: string, content: string): Promise<ChatMessage>;
  getChatMessagesByUserId(userId: string, limit?: number): Promise<ChatMessage[]>;
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

  async getRetirementPlansByUserId(userId: string): Promise<RetirementPlan[]> {
    return await db.select().from(retirementPlans).where(eq(retirementPlans.userId, userId));
  }

  // One-time expenses operations
  async createOneTimeExpense(expense: InsertOneTimeExpense): Promise<OneTimeExpense> {
    const [result] = await db.insert(oneTimeExpenses).values(expense).returning();
    return result;
  }

  async getOneTimeExpensesByUserId(userId: string): Promise<OneTimeExpense[]> {
    return await db.select().from(oneTimeExpenses).where(eq(oneTimeExpenses.userId, userId));
  }

  async getOneTimeExpensesByPlanId(planId: string): Promise<OneTimeExpense[]> {
    return await db.select().from(oneTimeExpenses).where(eq(oneTimeExpenses.retirementPlanId, planId));
  }

  async deleteOneTimeExpense(id: string, userId: string): Promise<void> {
    await db.delete(oneTimeExpenses).where(
      and(
        eq(oneTimeExpenses.id, id),
        eq(oneTimeExpenses.userId, userId)
      )
    );
  }

  async updateOneTimeExpense(id: string, userId: string, data: Partial<InsertOneTimeExpense>): Promise<OneTimeExpense | undefined> {
    const [result] = await db
      .update(oneTimeExpenses)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(oneTimeExpenses.id, id),
          eq(oneTimeExpenses.userId, userId)
        )
      )
      .returning();
    return result;
  }

  // Chat operations
  async createChatMessage(userId: string, role: string, content: string): Promise<ChatMessage> {
    const [result] = await db.insert(chatMessages).values({ userId, role, content }).returning();
    return result;
  }

  async getChatMessagesByUserId(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }
}

export const storage = new DbStorage();
