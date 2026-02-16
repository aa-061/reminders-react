import "./FormDialog.css";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

export interface FormDialogProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  showActions?: boolean;
  isSubmitting?: boolean;
  closeOnBackdropClick?: boolean;
}

export default function FormDialog({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  showActions = true,
  isSubmitting = false,
  closeOnBackdropClick = true,
}: FormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      dialogRef.current?.close();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !isSubmitting) {
      onSubmit(e);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdropClick || isSubmitting) return;

    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="FormDialog"
      aria-modal="true"
      aria-labelledby="form-dialog-title"
    >
      <div className="FormDialog__content">
        <div className="FormDialog__header">
          <h2 id="form-dialog-title" className="FormDialog__title">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="FormDialog__close btn btn--ghost btn--icon"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="FormDialog__form">
          <div className="FormDialog__body">{children}</div>

          {showActions && (
            <div className="FormDialog__actions">
              <button
                type="button"
                onClick={handleClose}
                className="FormDialog__button btn btn--secondary"
                disabled={isSubmitting}
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="FormDialog__button btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : submitText}
              </button>
            </div>
          )}
        </form>
      </div>
    </dialog>
  );
}
