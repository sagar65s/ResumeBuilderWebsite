import { User, InsertUser, Resume, InsertResume } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resume methods
  createResume(resume: InsertResume & { userId: number }): Promise<Resume>;
  getResumes(userId: number): Promise<Resume[]>;
  getResume(id: number): Promise<Resume | undefined>;
  updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;
}
