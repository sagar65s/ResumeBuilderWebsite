import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import NotFound from "@/pages/not-found";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/editor/:id">
        <ProtectedRoute component={Editor} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
