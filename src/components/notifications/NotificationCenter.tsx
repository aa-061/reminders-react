import "./NotificationCenter.css";
import { useStore } from "@tanstack/react-store";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  notificationStore,
  markAsRead,
  clearAll,
  removeNotification,
} from "@/stores/notificationStore";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useStore(notificationStore);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check size={16} />;
      case "error":
        return <AlertCircle size={16} />;
      case "warning":
        return <AlertTriangle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="NotificationCenter" ref={panelRef}>
      <button
        className="NotificationCenter__trigger btn btn--ghost btn--icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="NotificationCenter__badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="NotificationCenter__panel">
          <div className="NotificationCenter__header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="btn btn--ghost btn--sm">
                Clear all
              </button>
            )}
          </div>

          <div className="NotificationCenter__list">
            {notifications.length === 0 ? (
              <p className="NotificationCenter__empty">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`NotificationCenter__item NotificationCenter__item--${n.type} ${!n.read ? "NotificationCenter__item--unread" : ""}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <span className="NotificationCenter__icon">
                    {getIcon(n.type)}
                  </span>
                  <div className="NotificationCenter__content">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <small>{formatTime(n.timestamp)}</small>
                  </div>
                  <button
                    className="NotificationCenter__remove btn btn--ghost btn--icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                    aria-label="Remove notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
