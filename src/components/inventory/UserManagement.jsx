import { Shield, ShieldCheck, ShieldOff, UserCheck, UserX } from "lucide-react";
import { useManagedUsers, useToggleApproval, useToggleRole } from "@/hooks/useUserManagement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

export function UserManagement() {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useManagedUsers();
  const toggleApproval = useToggleApproval();
  const toggleRole = useToggleRole();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" /> Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {users.map((u) => {
              const isSelf = u.user_id === user?.id;
              return (
                <li key={u.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {u.full_name || "Unnamed user"}
                      {isSelf && <span className="text-muted-foreground ml-1">(you)</span>}
                    </span>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {u.role}
                      </Badge>
                      <Badge variant={u.approved ? "outline" : "destructive"} className="text-xs">
                        {u.approved ? "Approved" : "Blocked"}
                      </Badge>
                    </div>
                  </div>
                  {!isSelf && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        title={u.approved ? "Block user" : "Approve user"}
                        onClick={() => toggleApproval.mutate({ id: u.id, approved: !u.approved })}
                      >
                        {u.approved
                          ? <UserX className="h-3.5 w-3.5 text-destructive" />
                          : <UserCheck className="h-3.5 w-3.5 text-green-600" />
                        }
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        title={u.role === "admin" ? "Remove admin" : "Make admin"}
                        onClick={() => toggleRole.mutate({ id: u.id, role: u.role === "admin" ? "user" : "admin" })}
                      >
                        {u.role === "admin"
                          ? <ShieldOff className="h-3.5 w-3.5 text-destructive" />
                          : <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        }
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
