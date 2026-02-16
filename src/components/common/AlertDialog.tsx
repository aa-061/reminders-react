import "./AlertDialog.css";
import { useEffect, useRef } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: "success" | "error" | "info" | "warning";
  closeText?: string;
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  onClose,
  variant = "info",
  closeText = "OK",
}: AlertDialogProps) {
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
    onClose();
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
      handleClose();
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="AlertDialog__icon--success" size={32} />;
      case "error":
        return <XCircle className="AlertDialog__icon--error" size={32} />;
      case "warning":
        return <AlertTriangle className="AlertDialog__icon--warning" size={32} />;
      case "info":
        return <Info className="AlertDialog__icon--info" size={32} />;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className={`AlertDialog AlertDialog--${variant}`}
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-message"
    >
      <div className="AlertDialog__content">
        <button
          type="button"
          onClick={handleClose}
          className="AlertDialog__close btn--ghost btn--icon"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="AlertDialog__icon-wrapper">{getIcon()}</div>

        <h2 id="alert-dialog-title" className="AlertDialog__title">
          {title}
        </h2>

        <p id="alert-dialog-message" className="AlertDialog__message">
          {message}
        </p>

        <button
          type="button"
          onClick={handleClose}
          className={`AlertDialog__button btn ${variant === "error" ? "btn--danger" : variant === "success" ? "AlertDialog__button--success" : variant === "warning" ? "AlertDialog__button--warning" : ""}`}
          autoFocus
        >
          {closeText}
        </button>
      </div>
    </dialog>
  );
}
