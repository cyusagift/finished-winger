import { AlertTriangle, PackageX, Bell } from "lucide-react";
import { getStockStatus } from "@/types/inventory";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function LowStockAlerts({ products }) {
  const outOfStock = products.filter(p => getStockStatus(p.quantity, p.min_stock_level) === "out-of-stock");
  const lowStock = products.filter(p => getStockStatus(p.quantity, p.min_stock_level) === "low-stock");

  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  return (
    <div className="space-y-3 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-5 w-5 text-warning" />
        <h3 className="text-lg font-semibold">Stock Notifications</h3>
        <span className="inventory-badge inventory-badge-warning">
          {outOfStock.length + lowStock.length}
        </span>
      </div>

      {outOfStock.length > 0 && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <PackageX className="h-4 w-4" />
          <AlertTitle>Out of Stock ({outOfStock.length})</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {outOfStock.map(p => (
                <span key={p.id} className="inventory-badge inventory-badge-danger">{p.name}</span>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {lowStock.length > 0 && (
        <Alert className="border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Low Stock ({lowStock.length})</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStock.map(p => (
                <span key={p.id} className="inventory-badge inventory-badge-warning">
                  {p.name} — {p.quantity} left (min: {p.min_stock_level})
                </span>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
