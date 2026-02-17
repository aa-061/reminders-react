import "./ModeFormDialog.css";
import { ChevronDown, MessageSquare, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ZodError } from "zod";
import { useQuery } from "@tanstack/react-query";
import DialogContent from "@/components/common/DialogContent";
import { modeFormSchema } from "@/lib/validation";
import type { IMode, IModeFormData } from "@/types";

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

interface ModeFormDialogProps {
  mode: IMode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IModeFormData) => void;
}

export default function ModeFormDialog({
  mode,
  isOpen,
  onClose,
  onSave,
}: ModeFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState<IModeFormData>({
    mode: "email",
    address: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch Telegram bot info when Telegram is selected
  const { data: telegramInfo } = useQuery({
    queryKey: ["telegram-info"],
    queryFn: fetchTelegramInfo,
    enabled: formData.mode === "telegram",
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode) {
      setFormData({
        mode: mode.mode,
        address: mode.address,
        isDefault: mode.isDefault,
      });
    } else {
      setFormData({
        mode: "email",
        address: "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = modeFormSchema.parse(formData);
      onSave(validated);
      onClose();
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as ZodError<any>;
        const fieldErrors: Record<string, string> = {};
        zodError.issues.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0].toString();
            // Customize error message for telegram chat ID
            if (fieldName === "address" && formData.mode === "telegram" && err.message === "Address is required") {
              fieldErrors[fieldName] = "Please enter telegram chat id";
            } else {
              fieldErrors[fieldName] = err.message;
            }
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const handleBackdropClick = (
    e:
      | React.MouseEvent<HTMLDialogElement>
      | React.TouchEvent<HTMLDialogElement>,
  ) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="ModeFormDialog"
      onClick={handleBackdropClick}
      onTouchEnd={handleBackdropClick}
    >
      <DialogContent
        title={mode ? "Edit Mode" : "Add New Mode"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit} className="ModeFormDialog__form">
          <div className="form-group">
            <label htmlFor="mode-type">Mode Type</label>
            <div className="select-wrapper">
              <select
                id="mode-type"
                value={formData.mode}
                onChange={(e) => {
                  setFormData({ ...formData, mode: e.target.value as any, address: "" });
                  setErrors({});
                }}
              >
                <option value="email">Email</option>
                <option value="telegram">Telegram</option>
                <option value="sms">SMS</option>
                <option value="call">Call</option>
              </select>
              <ChevronDown size={20} className="select-icon" />
            </div>
            {errors.mode && (
              <span className="ModeFormDialog__error">{errors.mode}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mode-address">
              {formData.mode === "email"
                ? "Email Address"
                : formData.mode === "telegram"
                  ? "Telegram Chat ID"
                  : "Phone Number (E.164 format)"}
            </label>
            <input
              id="mode-address"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder={
                formData.mode === "email"
                  ? "example@email.com"
                  : formData.mode === "telegram"
                    ? ""
                    : "+1234567890"
              }
            />
            {errors.address && (
              <span className="ModeFormDialog__error">{errors.address}</span>
            )}
          </div>

          {/* Telegram Instructions */}
          {formData.mode === "telegram" && telegramInfo?.configured && (
            <div className="ModeFormDialog__telegram-info">
              <div className="ModeFormDialog__telegram-header">
                <MessageSquare size={18} />
                <span>Get your Telegram Chat ID</span>
              </div>
              <ol className="ModeFormDialog__telegram-steps">
                {telegramInfo.instructions?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {telegramInfo.deepLink && (
                <a
                  href={telegramInfo.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ModeFormDialog__telegram-link"
                >
                  <ExternalLink size={16} />
                  Open @{telegramInfo.botUsername} in Telegram
                </a>
              )}
            </div>
          )}

          {formData.mode === "telegram" && !telegramInfo?.configured && (
            <div className="ModeFormDialog__telegram-warning">
              <p>Telegram notifications are not configured on this server.</p>
            </div>
          )}

          <div className="form-group">
            <label className="ModeFormDialog__checkbox-label">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
              />
              Set as default mode
            </label>
          </div>

          <div className="ModeFormDialog__actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              disabled={formData.mode === "telegram" && !telegramInfo?.configured}
            >
              {mode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </dialog>
  );
}
