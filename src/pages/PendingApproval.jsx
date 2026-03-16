import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/ui/mode-toggle";

const PendingApproval = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto p-3 rounded-xl bg-orange-500/10 w-fit">
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Pending Approval</CardTitle>
          <CardDescription>
            Your account has been created but is awaiting admin approval.
            Please contact your administrator to get access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
