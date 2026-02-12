import "./QuickStats.css";
import { useQuery } from "@tanstack/react-query";

interface Reminder {
  id: number;
  title: string;
  date: string;
  is_active: boolean;
}

export default function QuickStats() {
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
      <div className="QuickStats">
        <div className="QuickStats__grid">
          <StatCard title="Total Active" value="..." />
          <StatCard title="Due Today" value="..." />
          <StatCard title="Due This Week" value="..." />
        </div>
      </div>
    );
  }

  const activeReminders = reminders || [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(today);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const dueToday = activeReminders.filter((r) => {
    const reminderDate = new Date(r.date);
    return reminderDate >= today && reminderDate < endOfToday;
  }).length;

  const dueThisWeek = activeReminders.filter((r) => {
    const reminderDate = new Date(r.date);
    return reminderDate >= today && reminderDate < endOfWeek;
  }).length;

  return (
    <div className="QuickStats">
      <div className="QuickStats__grid">
        <StatCard title="Total Active" value={activeReminders.length} />
        <StatCard title="Due Today" value={dueToday} />
        <StatCard title="Due This Week" value={dueThisWeek} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="QuickStats__card">
      <h3 className="QuickStats__card-title">{title}</h3>
      <p className="QuickStats__card-value">{value}</p>
    </div>
  );
}
