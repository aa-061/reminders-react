import "./ConfirmDialog.css";
import { useEffect, useRef } from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "info",
}: ConfirmDialogProps) {
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

  const handleConfirm = () => {
    onConfirm();
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    onCancel();
    dialogRef.current?.close();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      handleCancel();
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertCircle className="ConfirmDialog__icon--danger" size={24} />;
      case "warning":
        return <AlertTriangle className="ConfirmDialog__icon--warning" size={24} />;
      case "info":
        return <Info className="ConfirmDialog__icon--info" size={24} />;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleCancel}
      onClick={handleBackdropClick}
      className={`ConfirmDialog ConfirmDialog--${variant}`}
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className="ConfirmDialog__content">
        <div className="ConfirmDialog__header">
          {getIcon()}
          <h2 id="confirm-dialog-title" className="ConfirmDialog__title">
            {title}
          </h2>
        </div>

        <p id="confirm-dialog-message" className="ConfirmDialog__message">
          {message}
        </p>

        <div className="ConfirmDialog__actions">
          <button
            type="button"
            onClick={handleCancel}
            className="ConfirmDialog__button btn btn--secondary"
            autoFocus
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`ConfirmDialog__button btn ${variant === "danger" ? "btn--danger" : variant === "warning" ? "ConfirmDialog__button--warning" : ""}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}
