import "./ModeFormDialog.css";
import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { modeFormSchema } from "@/lib/validation";
import type { IMode, IModeFormData } from "@/types";
import type { ZodError } from "zod";

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
  const [formData, setFormData] = useState<IModeFormData>({
    mode: "email",
    address: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="ModeFormDialog">
      <div className="ModeFormDialog__content">
        <div className="ModeFormDialog__header">
          <h2>{mode ? "Edit Mode" : "Add New Mode"}</h2>
          <button onClick={onClose} className="ModeFormDialog__close" type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ModeFormDialog__form">
          <div className="form-group">
            <label htmlFor="mode-type">Mode Type</label>
            <div className="select-wrapper">
              <select
                id="mode-type"
                value={formData.mode}
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value })
                }
              >
                <option value="email">Email</option>
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
                  : "+1234567890"
              }
            />
            {errors.address && (
              <span className="ModeFormDialog__error">{errors.address}</span>
            )}
          </div>

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
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn">
              {mode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
