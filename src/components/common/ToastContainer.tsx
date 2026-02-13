import "./Toast.css";
import { useStore } from "@tanstack/react-store";
import { toastsStore } from "@/store";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useStore(toastsStore);

  return (
    <div className="ToastContainer">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {
            toastsStore.setState((prev) =>
              prev.filter((t) => t.id !== toast.id),
            );
          }}
        />
      ))}
    </div>
  );
}

// Utility function to show toasts
export function showToast(message: string, type: "success" | "error" | "info") {
  const id = Date.now().toString();
  toastsStore.setState((prev) => [...prev, { id, message, type }]);
}
