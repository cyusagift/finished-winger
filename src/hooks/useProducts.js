import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          category_id: product.category_id || null,
          sku: product.sku || null,
          quantity: product.quantity,
          min_stock_level: product.min_stock_level,
          cost_price: product.cost_price,
          selling_price: product.selling_price,
          description: product.description || null,
          color: product.color || null,
          size: product.size || null,
          supplier: product.supplier || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add product: " + error.message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: product.name,
          category_id: product.category_id || null,
          sku: product.sku || null,
          quantity: product.quantity,
          min_stock_level: product.min_stock_level,
          cost_price: product.cost_price,
          selling_price: product.selling_price,
          description: product.description || null,
          color: product.color || null,
          size: product.size || null,
          supplier: product.supplier || null,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ quantity })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock updated");
    },
    onError: (error) => {
      toast.error("Failed to update stock: " + error.message);
    },
  });
}
