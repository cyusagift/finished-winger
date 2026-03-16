import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

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

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Install Winger</CardTitle>
          <CardDescription>
            Add Winger to your home screen for quick access - works like a native app!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstalled ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <p className="text-lg font-medium text-success">App Installed!</p>
              <p className="text-sm text-muted-foreground text-center">
                Winger is on your home screen. You can open it anytime.
              </p>
            </div>
          ) : isIOS ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">To install on iPhone/iPad:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li className="flex items-start gap-2">
                  <span>
                    Tap the <Share className="inline h-4 w-4" /> Share button in Safari
                  </span>
                </li>
                <li>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </li>
                <li>
                  Tap <strong>"Add"</strong> to confirm
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} className="w-full gap-2" size="lg">
              <Download className="h-5 w-5" />
              Install App
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              <p>
                Open this page in <strong>Chrome</strong> or <strong>Edge</strong> on your phone to install.
              </p>
              <p className="mt-2">Or use browser menu -&gt; "Add to Home Screen"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
