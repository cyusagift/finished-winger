import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { supabase, supabaseConfigError } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StockLogs from "./pages/StockLogs";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import PendingApproval from "./pages/PendingApproval";

const queryClient = new QueryClient();

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label ?? "Request"} timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function LoadingScreen({ label }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted-foreground/40 border-t-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ConfigErrorScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-lg font-semibold">App setup required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {supabaseConfigError ?? "Missing required environment variables."}
        </p>
        <div className="mt-4 rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
          <div>VITE_SUPABASE_URL=...</div>
          <div>VITE_SUPABASE_ANON_KEY=...</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          After creating/updating <span className="font-mono">.env</span>, restart{" "}
          <span className="font-mono">npm run dev</span> /{" "}
          <span className="font-mono">npm run preview</span>.
        </p>
      </div>
    </div>
  );
}

function ApprovalErrorScreen({ message }) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-lg font-semibold">Can’t verify access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The app couldn’t confirm whether your account is approved. This is usually caused by a missing/failed
          Supabase RPC function (<span className="font-mono">is_approved</span>) or a network/config issue.
        </p>
        {message ? (
          <div className="mt-4 rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">{message}</div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [approved, setApproved] = useState(null);
  const [approvalError, setApprovalError] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (!supabase) return;

    let canceled = false;
    setApproved(null);
    setApprovalError(null);

    withTimeout(
      supabase.rpc("is_approved", { _user_id: user.id }),
      8000,
      "Approval check",
    )
      .then(({ data, error }) => {
        if (canceled) return;
        if (error) throw error;
        setApproved(!!data);
      })
      .catch((error) => {
        if (canceled) return;
        console.error("Approval check failed:", error);
        setApprovalError(error?.message ?? String(error));
        setApproved(false);
      });

    return () => {
      canceled = true;
    };
  }, [user]);

  if (loading || (user && approved === null)) {
    return <LoadingScreen label="Checking your session..." />;
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (approvalError) return <ApprovalErrorScreen message={approvalError} />;
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
        {supabaseConfigError ? (
          <ConfigErrorScreen />
        ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/stock-logs" element={<StockLogs />} />
            <Route path="/install" element={<Install />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        )}
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
