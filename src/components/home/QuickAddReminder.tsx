import "./QuickAddReminder.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

interface QuickReminderData {
  title: string;
  date: string;
  reminders: { id: string; mode: string; address: string }[];
  alerts: { id: string; time: number }[];
  is_recurring: boolean;
  description: string;
}

export default function QuickAddReminder() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const url = import.meta.env.VITE_SERVER_URL;

  if (!url) {
    throw new Error(
      "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
    );
  }

  const createMutation = useMutation({
    mutationFn: async (newReminder: QuickReminderData) => {
      const response = await fetch(`${url}/reminders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReminder),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create reminder");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setTitle("");
      setDate("");
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!date) {
      setError("Date is required");
      return;
    }

    const reminderDate = new Date(date);
    if (reminderDate <= new Date()) {
      setError("Date must be in the future");
      return;
    }

    const newReminder: QuickReminderData = {
      title: title.trim(),
      date: reminderDate.toISOString(),
      reminders: [],
      alerts: [],
      is_recurring: false,
      description: "",
    };

    createMutation.mutate(newReminder);
  };

  return (
    <div className="QuickAddReminder">
      <h2 className="QuickAddReminder__title">Quick Add Reminder</h2>
      <form onSubmit={handleSubmit} className="QuickAddReminder__form">
        <div className="QuickAddReminder__fields">
          <div className="QuickAddReminder__field">
            <label htmlFor="quick-title" className="QuickAddReminder__label">
              Title
            </label>
            <input
              id="quick-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to remember?"
              className="QuickAddReminder__input"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="QuickAddReminder__field">
            <label htmlFor="quick-date" className="QuickAddReminder__label">
              Date & Time
            </label>
            <input
              id="quick-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="QuickAddReminder__input"
              disabled={createMutation.isPending}
            />
          </div>
        </div>
        {error && <p className="QuickAddReminder__error">{error}</p>}
        <div className="QuickAddReminder__actions">
          <button
            type="submit"
            className="btn"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Adding..." : "Add Reminder"}
          </button>
          <Link to="/reminders/new" className="QuickAddReminder__full-form">
            Need more options? Use full form →
          </Link>
        </div>
      </form>
    </div>
  );
}
