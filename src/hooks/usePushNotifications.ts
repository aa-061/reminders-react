import { useState, useEffect, useCallback } from "react";

interface PushState {
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  loading: boolean;
  error: string | null;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function getVapidPublicKey(): Promise<string | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/push/vapid-public-key`
    );
    const data = await response.json();
    return data.configured ? data.publicKey : null;
  } catch {
    return null;
  }
}

async function saveSubscription(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/push/subscribe`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("p256dh")!)
              )
            ),
            auth: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("auth")!)
              )
            ),
          },
        }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

async function removeSubscription(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/push/unsubscribe`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export function usePushNotifications() {
  const [state, setState] = useState<PushState>({
    supported: false,
    permission: "default",
    subscribed: false,
    loading: true,
    error: null,
  });

  // Check initial state
  useEffect(() => {
    const checkState = async () => {
      // Check if push is supported
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      if (!supported) {
        setState((prev) => ({
          ...prev,
          supported: false,
          loading: false,
        }));
        return;
      }

      // Get current permission
      const permission = Notification.permission;

      // Check if already subscribed
      let subscribed = false;
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        subscribed = !!subscription;
      } catch {
        // Ignore errors
      }

      setState({
        supported,
        permission,
        subscribed,
        loading: false,
        error: null,
      });
    };

    checkState();
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setState((prev) => ({
          ...prev,
          permission,
          loading: false,
          error: "Notification permission denied",
        }));
        return false;
      }

      // Get VAPID public key
      const vapidKey = await getVapidPublicKey();
      if (!vapidKey) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Push notifications not configured on server",
        }));
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // Save to server
      const saved = await saveSubscription(subscription);

      if (!saved) {
        await subscription.unsubscribe();
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to save subscription",
        }));
        return false;
      }

      setState({
        supported: true,
        permission: "granted",
        subscribed: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to subscribe",
      }));
      return false;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await removeSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }

      setState((prev) => ({
        ...prev,
        subscribed: false,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to unsubscribe",
      }));
      return false;
    }
  }, []);

  // Send test notification
  const sendTest = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/push/test`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  }, []);

  return {
    ...state,
    subscribe,
    unsubscribe,
    sendTest,
  };
}
