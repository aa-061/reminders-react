import "./OfflineIndicator.css";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="OfflineIndicator" role="alert">
      <WifiOff size={16} />
      <span>You're offline. Changes will sync when you reconnect.</span>
    </div>
  );
}
