import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { useEmployees, useCreateEmployee, useDeleteEmployee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function EmployeeManager() {
  const { data: employees = [] } = useEmployees();
  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const [newName, setNewName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createEmployee.mutate(newName, { onSuccess: () => setNewName("") });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" /> Employees
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Employees</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Employee name"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={createEmployee.isPending || !newName.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {employees.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No employees added yet</p>
          )}
          {employees.map((emp) => (
            <li key={emp.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="text-sm">{emp.name}</span>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => deleteEmployee.mutate(emp.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
