import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Form Schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2" />
       <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full translate-y-1/3" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-400">
              {isLogin 
                ? "Enter your credentials to access your dashboard" 
                : "Sign up to start building professional resumes"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-black/20 border-white/10 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} className="bg-black/20 border-white/10 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-black/20 border-white/10 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-11 text-lg"
              >
                {isPending ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                form.reset();
              }}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
