import { IStorage } from "./storage";
import { User, InsertUser, Resume, InsertResume, users, resumes } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createResume(insertResume: InsertResume & { userId: number }): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async getResumes(userId: number): Promise<Resume[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: number): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }
}

export const storage = new DatabaseStorage();
