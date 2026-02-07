import React, { forwardRef } from 'react';
import { type ResumeContent } from '@shared/schema';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  content: ResumeContent;
  template?: 'modern' | 'classic' | 'minimal';
  className?: string;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ content, template = 'modern', className }, ref) => {
    // We can support multiple templates here. For now, let's build a really nice "modern" one.
    
    return (
      <div 
        id="resume-preview" 
        ref={ref}
        className={cn(
          "w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl mx-auto p-[10mm] md:p-[15mm] print:shadow-none print:p-0",
          className
        )}
      >
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-6 mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 mb-2">
            {content.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-4">
            {content.personalInfo.bio || "Professional Title / Short Bio"}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {content.personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>{content.personalInfo.email}</span>
              </div>
            )}
            {content.personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                <span>{content.personalInfo.phone}</span>
              </div>
            )}
            {content.personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{content.personalInfo.location}</span>
              </div>
            )}
            {content.personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="w-4 h-4" />
                <span>{content.personalInfo.linkedin}</span>
              </div>
            )}
            {content.personalInfo.github && (
              <div className="flex items-center gap-1.5">
                <Github className="w-4 h-4" />
                <span>{content.personalInfo.github}</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Experience Section */}
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2 mb-4">
                Experience
              </h2>
              <div className="space-y-6">
                {content.experience.map((job, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400" />
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-slate-800">{job.role}</h3>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600 whitespace-nowrap">
                        {job.startDate} — {job.current ? 'Present' : job.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 mb-2">{job.company}</div>
                    <div 
                      className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: job.description }} 
                    />
                  </div>
                ))}
                {content.experience.length === 0 && (
                  <p className="text-slate-400 italic">No experience added yet.</p>
                )}
              </div>
            </section>

            {/* Projects Section (Optional) */}
            {content.projects && content.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2 mb-4">
                  Projects
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {content.projects.map((project, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800">{project.name}</h3>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Link
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech, tIdx) => (
                            <span key={tIdx} className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Education Section */}
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-slate-800">{edu.school}</h3>
                    <div className="text-sm text-indigo-600 mb-1">{edu.degree}</div>
                    <div className="text-xs text-slate-500">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </div>
                  </div>
                ))}
                {content.education.length === 0 && (
                  <p className="text-slate-400 italic text-sm">No education added.</p>
                )}
              </div>
            </section>

            {/* Skills Section */}
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2 mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-800 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
                {content.skills.length === 0 && (
                  <p className="text-slate-400 italic text-sm">No skills added.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
