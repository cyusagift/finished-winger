import { getStockStatus } from "@/types/inventory";

const statusConfig = {
  "in-stock": { label: "In Stock", className: "inventory-badge-success" },
  "low-stock": { label: "Low Stock", className: "inventory-badge-warning" },
  "out-of-stock": { label: "Out of Stock", className: "inventory-badge-danger" },
};

export function StockBadge({ quantity, minStockLevel }) {
  const status = getStockStatus(quantity, minStockLevel);
  const config = statusConfig[status];

  return (
    <span className={`inventory-badge ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "in-stock" ? "bg-success" :
        status === "low-stock" ? "bg-warning" : "bg-destructive"
      }`} />
      {config.label}
    </span>
  );
}
