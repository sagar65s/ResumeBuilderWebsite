import { z } from "zod";
import { insertUserSchema, insertResumeSchema, generateResumeSchema, resumeContentSchema, resumes, users } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.custom<typeof users.$inferSelect | null>(), // Returns null if not logged in
      },
    },
  },
  ai: {
    generateResume: {
      method: "POST" as const,
      path: "/api/ai/generate-resume",
      input: generateResumeSchema,
      responses: {
        200: resumeContentSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  resumes: {
    list: {
      method: "GET" as const,
      path: "/api/resumes",
      responses: {
        200: z.array(z.custom<typeof resumes.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/resumes/:id",
      responses: {
        200: z.custom<typeof resumes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/resumes",
      input: insertResumeSchema,
      responses: {
        201: z.custom<typeof resumes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/resumes/:id",
      input: insertResumeSchema.partial(),
      responses: {
        200: z.custom<typeof resumes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/resumes/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    downloadPdf: {
        method: "GET" as const,
        path: "/api/resumes/:id/pdf",
        responses: {
            200: z.any() // Returns PDF blob/stream
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
