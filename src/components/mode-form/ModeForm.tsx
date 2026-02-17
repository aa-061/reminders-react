import "./ModeForm.css";
import { useState } from "react";
import { useStore } from "@tanstack/react-store";
import { modesStore, modeStore } from "@/store";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createMode } from "@/api/modes";
import type { ModeType } from "@/types";
import { MessageSquare, ExternalLink } from "lucide-react";

interface TelegramInfo {
  configured: boolean;
  botUsername?: string;
  deepLink?: string;
  instructions?: string[];
  message?: string;
}

async function fetchTelegramInfo(): Promise<TelegramInfo> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/telegram/info`,
    { credentials: "include" }
  );
  return response.json();
}

export default function ModeForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const modes = useStore(modesStore);
  const [modeType, setModeType] = useState<ModeType>("email");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // Fetch Telegram bot info when Telegram is selected
  const { data: telegramInfo } = useQuery({
    queryKey: ["telegram-info"],
    queryFn: fetchTelegramInfo,
    enabled: modeType === "telegram",
  });

  const mutation = useMutation({
    mutationFn: createMode,
    onSuccess: (newMode) => {
      modesStore.setState([...modes, newMode]);
      setAddress("");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["modes"] });
      onSuccess?.();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create mode");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    // Validate based on mode type
    if (modeType === "email") {
      if (!address.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }
    } else if (modeType === "telegram") {
      // Telegram chat IDs are numeric (can be negative for groups)
      if (!/^-?\d+$/.test(address.trim())) {
        setError("Please enter a valid Telegram Chat ID (numbers only)");
        return;
      }
    }

    mutation.mutate({ mode: modeType, address: address.trim() });
  };

  const getPlaceholder = () => {
    switch (modeType) {
      case "email":
        return "your@email.com";
      case "telegram":
        return "123456789";
      case "sms":
        return "+1234567890";
      default:
        return "Enter address";
    }
  };

  const getLabel = () => {
    switch (modeType) {
      case "email":
        return "Email Address";
      case "telegram":
        return "Telegram Chat ID";
      case "sms":
        return "Phone Number";
      default:
        return "Address";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ModeForm">
      <div className="ModeForm__row">
        <div className="ModeForm__field">
          <label htmlFor="mode-type">Notification Type</label>
          <select
            id="mode-type"
            value={modeType}
            onChange={(e) => {
              setModeType(e.target.value as ModeType);
              setAddress("");
              setError("");
            }}
          >
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
            <option value="sms">SMS (Coming Soon)</option>
          </select>
        </div>

        <div className="ModeForm__field">
          <label htmlFor="mode-address">{getLabel()}</label>
          <input
            id="mode-address"
            type={modeType === "email" ? "email" : "text"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={getPlaceholder()}
          />
        </div>
      </div>

      {/* Telegram Instructions */}
      {modeType === "telegram" && telegramInfo?.configured && (
        <div className="ModeForm__telegram-info">
          <div className="ModeForm__telegram-header">
            <MessageSquare size={18} />
            <span>Get your Telegram Chat ID</span>
          </div>
          <ol className="ModeForm__telegram-steps">
            {telegramInfo.instructions?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {telegramInfo.deepLink && (
            <a
              href={telegramInfo.deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ModeForm__telegram-link"
            >
              <ExternalLink size={16} />
              Open @{telegramInfo.botUsername} in Telegram
            </a>
          )}
        </div>
      )}

      {modeType === "telegram" && !telegramInfo?.configured && (
        <div className="ModeForm__telegram-warning">
          <p>Telegram notifications are not configured on this server.</p>
        </div>
      )}

      {error && <p className="ModeForm__error">{error}</p>}

      <button
        type="submit"
        className="btn"
        disabled={mutation.isPending || (modeType === "telegram" && !telegramInfo?.configured)}
      >
        {mutation.isPending ? "Adding..." : "Add Mode"}
      </button>
    </form>
  );
}
