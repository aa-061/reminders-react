import "./PWAUpdatePrompt.css";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw } from "lucide-react";

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="PWAUpdatePrompt">
      <div className="PWAUpdatePrompt__content">
        <div className="PWAUpdatePrompt__icon">
          <RefreshCw size={20} />
        </div>
        <div className="PWAUpdatePrompt__text">
          <p>A new version is available!</p>
        </div>
        <div className="PWAUpdatePrompt__actions">
          <button className="btn btn--sm" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn--sm btn--secondary" onClick={handleDismiss}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
