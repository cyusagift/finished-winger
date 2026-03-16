import { useState, useEffect } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/inventory/Header";
import { StatsCards } from "@/components/inventory/StatsCards";
import { LowStockAlerts } from "@/components/inventory/LowStockAlerts";
import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductForm } from "@/components/inventory/ProductForm";
import { EmployeeManager } from "@/components/inventory/EmployeeManager";
import { UserManagement } from "@/components/inventory/UserManagement";
import { useProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data, error }) => {
        if (error) throw error;
        setIsAdmin(!!data);
      })
      .catch((error) => {
        console.error("Failed to check role:", error);
        setIsAdmin(false);
      });
  }, [user]);

  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...data }, {
        onSuccess: () => setFormOpen(false),
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="page-title">Inventory Dashboard</h2>
            <p className="page-subtitle">Manage your bag inventory at Winger, Kigali</p>
          </div>
          <div className="flex gap-2">
            <Link to="/stock-logs">
              <Button variant="outline" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Stock Log
              </Button>
            </Link>
            {isAdmin && <UserManagement />}
            {isAdmin && <EmployeeManager />}
            <Button onClick={handleAddProduct} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <LowStockAlerts products={products} />
        <StatsCards products={products} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Products</h3>
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </main>

      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />
    </div>
  );
};

export default Index;
