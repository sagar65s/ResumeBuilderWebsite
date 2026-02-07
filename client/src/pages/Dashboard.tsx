import { useResumes, useCreateResume, useDeleteResume } from "@/hooks/use-resumes"; 
import { useUser as useUserHook, useLogout as useLogoutHook } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, Loader2, FileText, Trash2, LogOut, Edit3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { format } from "date-fns";
import { AIGeneratorDialog } from "@/components/AIGeneratorDialog";

export default function Dashboard() {
  const { data: user } = useUserHook();
  const { data: resumes, isLoading } = useResumes();
  const createResume = useCreateResume();
  const deleteResume = useDeleteResume();
  const logout = useLogoutHook();
  const [, setLocation] = useLocation();
  
  const [showAiDialog, setShowAiDialog] = useState(false);

  const handleCreateEmpty = () => {
    createResume.mutate({
      title: "Untitled Resume",
      content: {
        personalInfo: {
          fullName: user?.name || "",
          email: "",
          phone: "",
          bio: "",
        },
        experience: [],
        education: [],
        skills: [],
      },
      isAiGenerated: false
    });
  };

  const handleAiSuccess = (content: any) => {
    createResume.mutate({
      title: "AI Generated Resume",
      content,
      isAiGenerated: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-bold text-xl text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            ResumeAI
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:inline">Hello, {user?.name}</span>
            <Button variant="ghost" size="icon" onClick={() => logout.mutate()} className="text-slate-400 hover:text-white hover:bg-white/10">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
            <p className="text-slate-400">Manage and edit your resume collection</p>
          </div>
          <div className="flex gap-3">
             <Button 
              onClick={handleCreateEmpty} 
              variant="outline" 
              className="border-white/10 hover:bg-white/5 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Blank Resume
            </Button>
            <Button 
              onClick={() => setShowAiDialog(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New with AI
            </Button>
          </div>
        </div>

        {resumes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl border-dashed border-2 border-white/10 bg-transparent">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
            <p className="text-slate-400 max-w-sm mb-6">Create your first resume manually or let our AI assistant write one for you.</p>
            <Button onClick={() => setShowAiDialog(true)} variant="secondary">
              Generate with AI
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes?.map((resume) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative glass-card rounded-xl p-6 border border-white/5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resume.isAiGenerated ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10 -mr-2 -mt-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-white/10 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          This action cannot be undone. This will permanently delete your resume.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteResume.mutate(resume.id)}
                          className="bg-red-600 hover:bg-red-700 text-white border-0"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 truncate">{resume.title}</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                </p>

                <div className="flex gap-2">
                  <Link href={`/editor/${resume.id}`} className="flex-1">
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 text-white hover:bg-white/5"
                    onClick={() => setLocation(`/editor/${resume.id}?download=true`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AIGeneratorDialog 
          open={showAiDialog} 
          onOpenChange={setShowAiDialog}
          onSuccess={handleAiSuccess}
        />
      </main>
    </div>
  );
}
