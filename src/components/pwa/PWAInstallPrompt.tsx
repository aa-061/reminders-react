import "./PWAInstallPrompt.css";
import { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = "standalone" in window.navigator && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      // Show iOS instructions after a delay
      const timer = setTimeout(() => {
        // Check if user dismissed before
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (!dismissed) {
          setShowIOSInstructions(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Handle Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show anything if already installed
  if (isInstalled) return null;

  // Chrome/Android prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="PWAInstallPrompt">
        <div className="PWAInstallPrompt__content">
          <div className="PWAInstallPrompt__icon">
            <Download size={24} />
          </div>
          <div className="PWAInstallPrompt__text">
            <h3>Install Reminders</h3>
            <p>Add to your home screen for quick access and offline support</p>
          </div>
          <div className="PWAInstallPrompt__actions">
            <button className="btn btn--sm" onClick={handleInstall}>
              Install
            </button>
            <button
              className="PWAInstallPrompt__dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS instructions
  if (showIOSInstructions) {
    return (
      <div className="PWAInstallPrompt PWAInstallPrompt--ios">
        <div className="PWAInstallPrompt__content">
          <button
            className="PWAInstallPrompt__dismiss PWAInstallPrompt__dismiss--top"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
          <div className="PWAInstallPrompt__icon">
            <Download size={24} />
          </div>
          <div className="PWAInstallPrompt__text">
            <h3>Install Reminders</h3>
            <p>Add this app to your home screen for quick access</p>
          </div>
          <div className="PWAInstallPrompt__ios-steps">
            <div className="PWAInstallPrompt__ios-step">
              <Share size={20} />
              <span>Tap the Share button</span>
            </div>
            <div className="PWAInstallPrompt__ios-step">
              <PlusSquare size={20} />
              <span>Tap "Add to Home Screen"</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
