import { Store } from "@tanstack/store";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const notificationStore = new Store<Notification[]>([]);

export const addNotification = (
  notification: Omit<Notification, "id" | "timestamp" | "read">
) => {
  notificationStore.setState((prev) => [
    {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    },
    ...prev,
  ]);
};

export const markAsRead = (id: string) => {
  notificationStore.setState((prev) =>
    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
};

export const markAllAsRead = () => {
  notificationStore.setState((prev) => prev.map((n) => ({ ...n, read: true })));
};

export const removeNotification = (id: string) => {
  notificationStore.setState((prev) => prev.filter((n) => n.id !== id));
};

export const clearAll = () => {
  notificationStore.setState([]);
};
