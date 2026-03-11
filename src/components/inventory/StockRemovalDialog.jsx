import { useState } from "react";
import { useCreateStockLog } from "@/hooks/useStockLogs";
import { useEmployees } from "@/hooks/useEmployees";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StockRemovalDialog({ product, open, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const createStockLog = useCreateStockLog();
  const { data: employees = [] } = useEmployees();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product) return;
    createStockLog.mutate(
      {
        product_id: product.id,
        product_name: product.name,
        quantity_removed: quantity,
        previous_stock: product.quantity,
        new_stock: product.quantity - quantity,
        employee_name: employeeName,
        reason: reason || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setQuantity(1);
          setEmployeeName("");
          setReason("");
        },
      }
    );
  };

  const maxQty = product?.quantity ?? 0;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Stock</DialogTitle>
          <DialogDescription>
            Reducing stock for <span className="font-semibold text-foreground">{product?.name}</span>. Current stock: {product?.quantity}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select value={employeeName} onValueChange={setEmployeeName}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {employees.length === 0 && (
              <p className="text-xs text-muted-foreground">No employees added yet. Ask an admin to add employees.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty">Quantity to Remove *</Label>
            <Input
              id="qty" type="number" min={1} max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason" value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Sold to customer, damaged, etc."
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createStockLog.isPending || quantity < 1 || quantity > maxQty}>
              {createStockLog.isPending ? "Saving..." : "Confirm Removal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
