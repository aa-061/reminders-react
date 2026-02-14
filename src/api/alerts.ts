import type { IAlert, IAlertFormData } from "@/types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  throw new Error("VITE_SERVER_URL environment variable is not defined");
}

export async function fetchAlerts(): Promise<IAlert[]> {
  const response = await fetch(`${SERVER_URL}/alerts`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.statusText}`);
  }

  return response.json();
}

export async function createAlert(data: IAlertFormData): Promise<IAlert> {
  const response = await fetch(`${SERVER_URL}/alerts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create alert");
  }

  return response.json();
}

export async function updateAlert(
  id: number,
  data: Partial<IAlertFormData>,
): Promise<IAlert> {
  const response = await fetch(`${SERVER_URL}/alerts/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update alert");
  }

  return response.json();
}

export async function deleteAlert(id: number): Promise<void> {
  const response = await fetch(`${SERVER_URL}/alerts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete alert");
  }
}
