import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertResume, type GenerateResumeRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useResumes() {
  return useQuery({
    queryKey: [api.resumes.list.path],
    queryFn: async () => {
      const res = await fetch(api.resumes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch resumes");
      return api.resumes.list.responses[200].parse(await res.json());
    },
  });
}

export function useResume(id: number) {
  return useQuery({
    queryKey: [api.resumes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.resumes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch resume");
      return api.resumes.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertResume) => {
      const validated = api.resumes.create.input.parse(data);
      const res = await fetch(api.resumes.create.path, {
        method: api.resumes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create resume");
      return api.resumes.create.responses[201].parse(await res.json());
    },
    onSuccess: (resume) => {
      queryClient.invalidateQueries({ queryKey: [api.resumes.list.path] });
      toast({ title: "Resume created", description: "Start editing your new resume" });
      setLocation(`/editor/${resume.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create resume", variant: "destructive" });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertResume>) => {
      const validated = api.resumes.update.input.parse(updates);
      const url = buildUrl(api.resumes.update.path, { id });
      const res = await fetch(url, {
        method: api.resumes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update resume");
      return api.resumes.update.responses[200].parse(await res.json());
    },
    onSuccess: (resume) => {
      queryClient.invalidateQueries({ queryKey: [api.resumes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.resumes.get.path, resume.id] });
      toast({ title: "Saved", description: "Your changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.resumes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.resumes.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete resume");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.resumes.list.path] });
      toast({ title: "Deleted", description: "Resume has been deleted permanently." });
    },
  });
}

export function useGenerateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateResumeRequest) => {
      const validated = api.ai.generateResume.input.parse(data);
      const res = await fetch(api.ai.generateResume.path, {
        method: api.ai.generateResume.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("AI Generation failed");
      return api.ai.generateResume.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "AI Magic Complete", description: "Resume content generated successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Could not generate resume",
        variant: "destructive" 
      });
    },
  });
}
