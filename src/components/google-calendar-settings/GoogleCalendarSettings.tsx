import "./GoogleCalendarSettings.css";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Link2, Link2Off, ExternalLink, RefreshCw } from "lucide-react";

interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  message: string;
}

async function fetchGoogleStatus(): Promise<GoogleStatus> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/google/status`,
    { credentials: "include" }
  );
  return response.json();
}

async function getAuthUrl(): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/google/auth`,
    { credentials: "include" }
  );
  const data = await response.json();
  return data.authUrl;
}

async function disconnectGoogle(): Promise<void> {
  await fetch(`${import.meta.env.VITE_SERVER_URL}/api/google/disconnect`, {
    method: "POST",
    credentials: "include",
  });
}

export default function GoogleCalendarSettings() {
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ["google-status"],
    queryFn: fetchGoogleStatus,
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-status"] });
    },
  });

  // Check URL params for OAuth callback result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("google_success")) {
      queryClient.invalidateQueries({ queryKey: ["google-status"] });
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("google_error")) {
      console.error("Google OAuth error:", params.get("google_error"));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to get auth URL:", error);
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="GoogleCalendarSettings GoogleCalendarSettings--loading">
        <RefreshCw size={24} className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!status?.configured) {
    return (
      <div className="GoogleCalendarSettings GoogleCalendarSettings--unconfigured">
        <div className="GoogleCalendarSettings__icon">
          <Calendar size={24} />
        </div>
        <div className="GoogleCalendarSettings__content">
          <h3>Google Calendar</h3>
          <p>Google Calendar integration is not configured on this server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="GoogleCalendarSettings">
      <div className="GoogleCalendarSettings__header">
        <div className="GoogleCalendarSettings__icon">
          <Calendar size={24} />
        </div>
        <div className="GoogleCalendarSettings__content">
          <h3>Google Calendar</h3>
          <p>
            {status.connected
              ? "Your Google Calendar is connected. Reminders can be synced to your calendar."
              : "Connect your Google Calendar to sync reminders automatically."}
          </p>
        </div>
      </div>

      <div className="GoogleCalendarSettings__status">
        <span
          className={`GoogleCalendarSettings__badge ${
            status.connected
              ? "GoogleCalendarSettings__badge--connected"
              : "GoogleCalendarSettings__badge--disconnected"
          }`}
        >
          {status.connected ? (
            <>
              <Link2 size={14} />
              Connected
            </>
          ) : (
            <>
              <Link2Off size={14} />
              Not Connected
            </>
          )}
        </span>
      </div>

      <div className="GoogleCalendarSettings__actions">
        {status.connected ? (
          <button
            className="btn btn--secondary"
            onClick={handleDisconnect}
            disabled={disconnectMutation.isPending}
          >
            {disconnectMutation.isPending ? (
              <RefreshCw size={18} className="spinner" />
            ) : (
              "Disconnect"
            )}
          </button>
        ) : (
          <button
            className="btn"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <RefreshCw size={18} className="spinner" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink size={18} />
                Connect Google Calendar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
