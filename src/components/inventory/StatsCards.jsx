import { Package, AlertTriangle, TrendingUp, Boxes } from "lucide-react";
import { getStockStatus } from "@/types/inventory";

export function StatsCards({ products }) {
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = products.filter(p => getStockStatus(p.quantity, p.min_stock_level) === "low-stock").length;
  const outOfStockCount = products.filter(p => getStockStatus(p.quantity, p.min_stock_level) === "out-of-stock").length;
  const totalValue = products.reduce((sum, p) => sum + (p.selling_price * p.quantity), 0);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      subtitle: `${totalItems} items in stock`,
      icon: Package,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockCount,
      subtitle: "Need restocking",
      icon: AlertTriangle,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      subtitle: "Urgent attention",
      icon: Boxes,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
    },
    {
      title: "Stock Value",
      value: `${totalValue.toLocaleString()} RWF`,
      subtitle: "Total inventory value",
      icon: TrendingUp,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={stat.title} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          <div className="stat-card-gradient" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
