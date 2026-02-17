import "./PushNotificationSettings.css";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff, RefreshCw, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";

export default function PushNotificationSettings() {
  const {
    supported,
    permission,
    subscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
    sendTest,
  } = usePushNotifications();

  const [testSent, setTestSent] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const handleToggle = async () => {
    if (subscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleTest = async () => {
    setTestLoading(true);
    const success = await sendTest();
    setTestSent(success);
    setTestLoading(false);

    if (success) {
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  if (!supported) {
    return (
      <div className="PushNotificationSettings PushNotificationSettings--unsupported">
        <div className="PushNotificationSettings__icon">
          <BellOff size={24} />
        </div>
        <div className="PushNotificationSettings__content">
          <h3>Push Notifications Not Supported</h3>
          <p>
            Your browser or device doesn't support push notifications.
            {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
              <span>
                {" "}
                On iOS, install this app to your home screen first (iOS 16.4+
                required).
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="PushNotificationSettings PushNotificationSettings--denied">
        <div className="PushNotificationSettings__icon">
          <AlertTriangle size={24} />
        </div>
        <div className="PushNotificationSettings__content">
          <h3>Notifications Blocked</h3>
          <p>
            You've blocked notifications for this app. To enable them, update
            your browser's site settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="PushNotificationSettings">
      <div className="PushNotificationSettings__header">
        <div className="PushNotificationSettings__icon">
          {subscribed ? <Bell size={24} /> : <BellOff size={24} />}
        </div>
        <div className="PushNotificationSettings__content">
          <h3>Push Notifications</h3>
          <p>
            {subscribed
              ? "You'll receive push notifications for your reminders"
              : "Enable to receive push notifications on this device"}
          </p>
        </div>
      </div>

      {error && (
        <div className="PushNotificationSettings__error">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="PushNotificationSettings__actions">
        <button
          className={`btn ${subscribed ? "btn--secondary" : ""}`}
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw size={18} className="spinner" />
          ) : subscribed ? (
            "Disable Notifications"
          ) : (
            "Enable Notifications"
          )}
        </button>

        {subscribed && (
          <button
            className="btn btn--outline"
            onClick={handleTest}
            disabled={testLoading}
          >
            {testLoading ? (
              <RefreshCw size={18} className="spinner" />
            ) : testSent ? (
              <>
                <Check size={18} />
                Sent!
              </>
            ) : (
              "Send Test"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
