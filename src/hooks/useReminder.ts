import { useQuery } from "@tanstack/react-query";
import type { IReminder } from "@/types";

const API_URL = import.meta.env.VITE_SERVER_URL;

if (!API_URL) {
  throw new Error(
    "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
  );
}

export function useReminder(id: string | number) {
  return useQuery<IReminder>({
    queryKey: ["reminder", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/reminders/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reminder");
      }
      return response.json();
    },
    enabled: !!id,
  });
}
