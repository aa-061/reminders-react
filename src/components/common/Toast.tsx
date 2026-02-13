import "./Toast.css";
import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`Toast Toast--${type}`} role="alert">
      <div className="Toast__icon">{icons[type]}</div>
      <div className="Toast__message">{message}</div>
      <button
        className="Toast__close"
        onClick={onClose}
        aria-label="Close notification"
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  );
}
