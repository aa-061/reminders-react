import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface ShortcutHandler {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey;
        const metaMatch = shortcut.metaKey ? e.metaKey : !e.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts() {
  const navigate = useNavigate();

  useKeyboardShortcuts([
    {
      key: "n",
      action: () => navigate({ to: "/reminders/new" }),
      description: "Create new reminder",
    },
    {
      key: "r",
      action: () => navigate({ to: "/reminders" }),
      description: "Go to reminders",
    },
    {
      key: "h",
      action: () => navigate({ to: "/" }),
      description: "Go to home",
    },
    {
      key: "d",
      action: () => navigate({ to: "/dashboard" }),
      description: "Go to dashboard",
    },
    {
      key: "s",
      action: () => navigate({ to: "/settings" }),
      description: "Go to settings",
    },
    {
      key: "/",
      action: () => {
        const searchInput = document.querySelector<HTMLInputElement>(
          ".RemindersFilter__search-input"
        );
        searchInput?.focus();
      },
      description: "Focus search",
    },
  ]);
}

// Export shortcut descriptions for help display
export const SHORTCUT_DESCRIPTIONS = [
  { key: "n", description: "Create new reminder" },
  { key: "r", description: "Go to reminders" },
  { key: "h", description: "Go to home" },
  { key: "d", description: "Go to dashboard" },
  { key: "s", description: "Go to settings" },
  { key: "/", description: "Focus search" },
];
