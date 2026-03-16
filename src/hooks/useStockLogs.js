import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStockLogs() {
  return useQuery({
    queryKey: ["stock_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStockLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log) => {
      const { error: stockError } = await supabase
        .from("products")
        .update({ quantity: log.new_stock })
        .eq("id", log.product_id);
      if (stockError) throw stockError;

      const { error: logError } = await supabase.from("stock_logs").insert({
        product_id: log.product_id,
        product_name: log.product_name,
        quantity_removed: log.quantity_removed,
        previous_stock: log.previous_stock,
        new_stock: log.new_stock,
        employee_name: log.employee_name,
        reason: log.reason || null,
      });
      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock_logs"] });
      toast.success("Stock reduced and logged");
    },
    onError: (error) => {
      toast.error("Failed to update stock: " + error.message);
    },
  });
}
