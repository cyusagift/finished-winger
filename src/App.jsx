import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StockLogs from "./pages/StockLogs";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import PendingApproval from "./pages/PendingApproval";

const queryClient = new QueryClient();

function LoadingScreen({ label }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted-foreground/40 border-t-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("is_approved", { _user_id: user.id }).then(({ data }) => {
      setApproved(!!data);
    });
  }, [user]);

  if (loading || (user && approved === null)) {
    return <LoadingScreen label="Checking your session..." />;
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!approved) return <PendingApproval />;

  return <>{children}</>;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Loading..." />;
  }

  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/stock-logs" element={<StockLogs />} />
            <Route path="/install" element={<Install />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
