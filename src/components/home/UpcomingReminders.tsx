import "./UpcomingReminders.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Contact {
  mode: string;
  address: string;
}

interface Reminder {
  id: number;
  title: string;
  date: string;
  description: string;
  reminders: Contact[];
  alerts: number[];
  is_recurring: boolean;
  is_active: boolean;
}

export default function UpcomingReminders() {
  const url = import.meta.env.VITE_SERVER_URL;

  if (!url) {
    throw new Error(
      "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
    );
  }

  const { data: reminders, isPending } = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: () =>
      fetch(`${url}/reminders`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json()),
  });

  if (isPending) {
    return (
      <div className="UpcomingReminders">
        <h2 className="UpcomingReminders__title">Upcoming Reminders</h2>
        <div className="UpcomingReminders__loading">Loading...</div>
      </div>
    );
  }

  const now = new Date();
  const upcomingReminders = (reminders || [])
    .filter((r) => new Date(r.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (upcomingReminders.length === 0) {
    return (
      <div className="UpcomingReminders">
        <h2 className="UpcomingReminders__title">Upcoming Reminders</h2>
        <div className="UpcomingReminders__empty">
          <p>No upcoming reminders</p>
          <Link to="/reminders/new" className="btn">
            Create your first reminder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="UpcomingReminders">
      <div className="UpcomingReminders__header">
        <h2 className="UpcomingReminders__title">Upcoming Reminders</h2>
        <Link to="/reminders" className="UpcomingReminders__view-all">
          View all →
        </Link>
      </div>
      <ul className="UpcomingReminders__list">
        {upcomingReminders.map((reminder) => (
          <ReminderItem key={reminder.id} reminder={reminder} />
        ))}
      </ul>
    </div>
  );
}

interface ReminderItemProps {
  reminder: Reminder;
}

function ReminderItem({ reminder }: ReminderItemProps) {
  const [countdown, setCountdown] = useState("");
  const queryClient = useQueryClient();
  const url = import.meta.env.VITE_SERVER_URL;

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${url}/reminders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete reminder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const reminderDate = new Date(reminder.date);
      const diff = reminderDate.getTime() - now.getTime();

      if (diff < 0) {
        setCountdown("Past due");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setCountdown(`in ${hours}h ${minutes}m`);
      } else {
        setCountdown(`in ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [reminder.date]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const handleDelete = () => {
    if (confirm(`Delete reminder "${reminder.title}"?`)) {
      deleteMutation.mutate(reminder.id);
    }
  };

  return (
    <li className="UpcomingReminders__item">
      <div className="UpcomingReminders__item-content">
        <div className="UpcomingReminders__item-main">
          <h3 className="UpcomingReminders__item-title">{reminder.title}</h3>
          <p className="UpcomingReminders__item-date">
            {formatDate(reminder.date)}
          </p>
        </div>
        <span className="UpcomingReminders__item-countdown">{countdown}</span>
      </div>
      <div className="UpcomingReminders__item-actions">
        <Link
          to="/reminders/$id/edit"
          params={{ id: reminder.id.toString() }}
          className="btn btn--secondary"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="btn btn--danger"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
