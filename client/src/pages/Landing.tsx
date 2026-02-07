import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2, FileText, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-600/20 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-2xl text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Resume<span className="text-purple-400">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-background hover:bg-slate-200 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by GPT-4o Technology</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl"
        >
          Craft Your Perfect Resume with <span className="text-gradient">Artificial Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Stand out from the crowd. Our AI analyzes your experience and builds a professional, tailored resume in seconds—not hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/register">
            <Button className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-full">
              Build My Resume Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-14 px-8 text-lg border-white/10 text-white hover:bg-white/5 hover:text-white rounded-full bg-transparent">
              View Examples
            </Button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              icon: Wand2,
              title: "AI Generation",
              desc: "Enter your role and skills, and let AI write professional descriptions for you."
            },
            {
              icon: FileText,
              title: "ATS Friendly",
              desc: "Templates designed to pass Applicant Tracking Systems and get you hired."
            },
            {
              icon: CheckCircle2,
              title: "Real-time Preview",
              desc: "See changes instantly as you edit. Download as PDF with one click."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
