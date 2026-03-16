import { useState } from "react";
import { useStockLogs } from "@/hooks/useStockLogs";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/inventory/Header";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

const StockLogs = () => {
  const { data: logs = [], isLoading } = useStockLogs();
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.product_name.toLowerCase().includes(search.toLowerCase()) ||
      l.employee_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header title="Stock Removal Log" subtitle="Winger — Kigali, Rwanda" />
      <main className="container mx-auto px-4 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Inventory
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            This log is public and cannot be edited or deleted.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product or employee name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Qty Removed</TableHead>
                    <TableHead className="text-center">Stock Before</TableHead>
                    <TableHead className="text-center">Stock After</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No stock removal logs yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {format(new Date(log.created_at), "dd MMM yyyy, HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">{log.product_name}</TableCell>
                        <TableCell>{log.employee_name}</TableCell>
                        <TableCell className="text-center font-semibold text-destructive">
                          -{log.quantity_removed}
                        </TableCell>
                        <TableCell className="text-center">{log.previous_stock}</TableCell>
                        <TableCell className="text-center">{log.new_stock}</TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {log.reason || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StockLogs;
