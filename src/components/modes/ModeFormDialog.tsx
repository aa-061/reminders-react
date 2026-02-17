import "./ModeFormDialog.css";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ZodError } from "zod";
import DialogContent from "@/components/common/DialogContent";
import { modeFormSchema } from "@/lib/validation";
import type { IMode, IModeFormData } from "@/types";

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
    <dialog
      ref={dialogRef}
      className="ModeFormDialog"
      onClick={handleBackdropClick}
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
              <button
                type="button"
                onClick={handleClose}
                className="btn btn--secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                {mode ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
    </dialog>
  );
}
