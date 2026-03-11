import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useManagedUsers() {
  return useQuery({
    queryKey: ["managed-users"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at");
      if (rolesError) throw rolesError;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name");
      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) ?? []);

      return (roles ?? []).map((r) => ({
        ...r,
        full_name: profileMap.get(r.user_id) ?? null,
        email: null,
      }));
    },
  });
}

export function useToggleApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ approved })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { approved }) => {
      qc.invalidateQueries({ queryKey: ["managed-users"] });
      toast.success(approved ? "User approved" : "User blocked");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useToggleRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { role }) => {
      qc.invalidateQueries({ queryKey: ["managed-users"] });
      toast.success(role === "admin" ? "Admin privileges granted" : "Admin privileges revoked");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}
