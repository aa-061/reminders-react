import type { IMode, IModeFormData } from "@/types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  throw new Error("VITE_SERVER_URL environment variable is not defined");
}

export async function fetchModes(): Promise<IMode[]> {
  const response = await fetch(`${SERVER_URL}/modes`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch modes: ${response.statusText}`);
  }

  return response.json();
}

export async function createMode(data: IModeFormData): Promise<IMode> {
  const response = await fetch(`${SERVER_URL}/modes`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create mode");
  }

  return response.json();
}

export async function updateMode(
  id: number,
  data: Partial<IModeFormData>,
): Promise<IMode> {
  const response = await fetch(`${SERVER_URL}/modes/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update mode");
  }

  return response.json();
}

export async function deleteMode(id: number): Promise<void> {
  const response = await fetch(`${SERVER_URL}/modes/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete mode");
  }
}
