import "./Dialog.css";
import { useStore } from "@tanstack/react-store";
import { useEffect, useRef } from "react";
import { dialogStore } from "@/store";

export default function Dialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialog = useStore(dialogStore);
  const { isOpen, onClose, children } = dialog;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      // .showModal() handles the backdrop and focus trapping automatically
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose(e: React.MouseEvent<HTMLDialogElement>) {
    dialogStore.setState({ ...dialog, children: null, isOpen: false });
    onClose(e);
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      handleClose(e);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose} // Triggered by 'Esc' key or dialog.close()
      onClick={handleBackdropClick}
      className="Dialog"
      aria-modal="true"
    >
      {children}
    </dialog>
  );
}
