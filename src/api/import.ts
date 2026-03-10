import type { IReminder } from "@/types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  throw new Error("VITE_SERVER_URL environment variable is not defined");
}

export interface ImportIcsResponse extends IReminder {
  message: string;
}

export async function importIcsFile(file: File): Promise<ImportIcsResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${SERVER_URL}/reminders/import-ics`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to import ICS file");
  }

  return response.json();
}
