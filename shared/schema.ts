import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Content Types
export const resumeContentSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    bio: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    location: z.string().optional(),
  }),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string(), // Bullet points as a single string or array? Let's assume string for simplicity or HTML
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().optional(),
    techStack: z.array(z.string()).optional(),
  })).optional(),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true, // Set by backend
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

// AI Generation Input
export const generateResumeSchema = z.object({
  jobRole: z.string(),
  experienceLevel: z.enum(["Fresher", "Experienced"]),
  skills: z.string().optional(), // Comma separated or free text
  currentEducation: z.string().optional(),
  projectsContext: z.string().optional(),
});

export type GenerateResumeRequest = z.infer<typeof generateResumeSchema>;

export * from "./models/chat";
