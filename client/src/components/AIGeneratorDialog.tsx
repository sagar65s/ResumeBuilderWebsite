import { useState } from 'react';
import { useGenerateResume } from '@/hooks/use-resumes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { type ResumeContent } from '@shared/schema';

interface AIGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (content: ResumeContent) => void;
}

export function AIGeneratorDialog({ open, onOpenChange, onSuccess }: AIGeneratorDialogProps) {
  const generate = useGenerateResume();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: 'Experienced' as 'Experienced' | 'Fresher',
    skills: '',
    currentEducation: '',
    projectsContext: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate.mutate(formData, {
      onSuccess: (data) => {
        onSuccess(data);
        onOpenChange(false);
        setStep(1); // Reset for next time
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-[500px] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gradient">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Resume Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Tell us a bit about yourself, and we'll draft a professional resume for you in seconds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name </Label>
              <Input 
                placeholder="enter your name..."
                className="bg-black/20 border-white/10 focus:border-purple-500/50"
                value={formData.jobRole}
                onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select 
                value={formData.experienceLevel} 
                onValueChange={(val: any) => setFormData({...formData, experienceLevel: val})}
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fresher">Fresher / Student</SelectItem>
                  <SelectItem value="Experienced">Experienced Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Key Skills </Label>
              <Input 
                placeholder="React, TypeScript, Node.js..."
                className="bg-black/20 border-white/10"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
            
             <div className="space-y-2">
              <Label>Education </Label>
              <Input 
                placeholder="BS Computer Science, University of..."
                className="bg-black/20 border-white/10"
                value={formData.currentEducation}
                onChange={(e) => setFormData({...formData, currentEducation: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Context (Projects/Achievements)</Label>
              <Textarea 
                placeholder="I built a resume builder app..."
                className="bg-black/20 border-white/10 min-h-[100px]"
                value={formData.projectsContext}
                onChange={(e) => setFormData({...formData, projectsContext: e.target.value})}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={generate.isPending}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
          >
            {generate.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Resume
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
