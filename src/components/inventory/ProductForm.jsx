import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  category_id: z.string().optional(),
  sku: z.string().max(50).optional(),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
  min_stock_level: z.coerce.number().min(0, "Minimum stock must be 0 or more"),
  cost_price: z.coerce.number().min(0, "Cost price must be 0 or more"),
  selling_price: z.coerce.number().min(0, "Selling price must be 0 or more"),
  description: z.string().max(500).optional(),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  supplier: z.string().max(100).optional(),
});

export function ProductForm({ open, onClose, onSubmit, product, isLoading }) {
  const { data: categories = [] } = useCategories();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category_id: product?.category_id || "",
      sku: product?.sku || "",
      quantity: product?.quantity || 0,
      min_stock_level: product?.min_stock_level || 5,
      cost_price: product?.cost_price || 0,
      selling_price: product?.selling_price || 0,
      description: product?.description || "",
      color: product?.color || "",
      size: product?.size || "",
      supplier: product?.supplier || "",
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., School Backpack Pro" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="category_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl><Input placeholder="e.g., BAG-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity *</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="min_stock_level" render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Alert Level</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cost_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price (RWF)</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="selling_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price (RWF)</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl><Input placeholder="e.g., Black" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="size" render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl><Input placeholder="e.g., Large" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="supplier" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Supplier</FormLabel>
                  <FormControl><Input placeholder="e.g., ABC Supplies Ltd" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Product description..." rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
