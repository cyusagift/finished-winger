import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigError =
  !SUPABASE_URL || !SUPABASE_KEY
    ? "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in a .env file at the project root, then restart the dev server."
    : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
