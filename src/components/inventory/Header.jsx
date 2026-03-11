import { useState, useEffect } from "react";
import { Package, LogOut, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

export function Header({ title = "Winger", subtitle = "Inventory Management System" }) {
  const { user, signOut } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSDialog(true);
    } else {
      window.location.href = "/install";
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {!isInstalled && (
              <>
                <Button variant="outline" size="sm" className="gap-2 hidden md:flex" onClick={handleInstallClick}>
                  <Download className="h-4 w-4" />
                  <span>Install App</span>
                </Button>
                <Button variant="outline" size="icon" className="md:hidden" onClick={handleInstallClick}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Install App</span>
                </Button>
              </>
            )}
            <ModeToggle />
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install on iPhone/iPad</DialogTitle>
            <DialogDescription>Follow these steps to install Winger:</DialogDescription>
          </DialogHeader>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span>Tap the <Share className="inline h-4 w-4" /> Share button in Safari</span>
            </li>
            <li>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></li>
            <li>Tap <strong className="text-foreground">"Add"</strong> to confirm</li>
          </ol>
        </DialogContent>
      </Dialog>
    </header>
  );
}
