import { useState, useEffect } from "react";
import { supabase, supabaseConfigError } from "@/integrations/supabase/client";

export function useAuth() {
  if (supabaseConfigError || !supabase) {
    if (supabaseConfigError) console.error(supabaseConfigError);
    return {
      user: null,
      session: null,
      loading: false,
      signOut: async () => {},
    };
  }

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: nextSession } }) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to get session:", error);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signOut };
}
