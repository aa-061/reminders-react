import "./AlertFormDialog.css";
import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { alertFormSchema } from "@/lib/validation";
import { timeToMs, msToTimeUnit, MIN_ALERT_MS } from "@/utils/time";
import type { IAlert } from "@/types";
import type { ZodError } from "zod";

interface AlertFormDialogProps {
  alert: IAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; ms: number }) => void;
}

interface FormState {
  name: string;
  value: number;
  unit: string;
}

export default function AlertFormDialog({
  alert,
  isOpen,
  onClose,
  onSave,
}: AlertFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    value: 5,
    unit: "minutes",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (alert) {
      const { value, unit } = msToTimeUnit(alert.ms);
      setFormData({
        name: alert.name,
        value,
        unit,
      });
    } else {
      setFormData({
        name: "",
        value: 5,
        unit: "minutes",
      });
    }
    setErrors({});
  }, [alert, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = alertFormSchema.parse(formData);
      const ms = timeToMs(validated.value, validated.unit);

      if (ms < MIN_ALERT_MS) {
        setErrors({ value: "Alert must be at least 3 seconds" });
        return;
      }

      onSave({ name: validated.name, ms });
      onClose();
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as ZodError;
        const fieldErrors: Record<string, string> = {};
        zodError.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0].toString()] = err.message;
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="AlertFormDialog" onClick={handleBackdropClick}>
      <div className="AlertFormDialog__content" onClick={(e) => e.stopPropagation()}>
        <div className="AlertFormDialog__header">
          <h2>{alert ? "Edit Alert" : "Add New Alert"}</h2>
          <button onClick={handleClose} className="AlertFormDialog__close btn--ghost btn--icon" type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="AlertFormDialog__form">
          <div className="form-group">
            <label htmlFor="alert-name">Alert Name</label>
            <input
              id="alert-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., 15 minutes before"
            />
            {errors.name && (
              <span className="AlertFormDialog__error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="alert-value">Time Before Reminder</label>
            <div className="AlertFormDialog__time-input">
              <input
                id="alert-value"
                type="number"
                min="1"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                className="AlertFormDialog__value-input"
              />
              <div className="select-wrapper">
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>
            {errors.value && (
              <span className="AlertFormDialog__error">{errors.value}</span>
            )}
            {errors.unit && (
              <span className="AlertFormDialog__error">{errors.unit}</span>
            )}
            <p className="AlertFormDialog__hint">Minimum: 3 seconds</p>
          </div>

          <div className="AlertFormDialog__actions">
            <button type="button" onClick={handleClose} className="btn btn--secondary">
              Cancel
            </button>
            <button type="submit" className="btn">
              {alert ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
