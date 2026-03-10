import "./index.css";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { IReminder } from "@/types";
import StatCard from "@/components/dashboard/StatCard";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

async function fetchReminders(): Promise<IReminder[]> {
  const response = await fetch(`${SERVER_URL}/reminders/all`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reminders: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }

  return data;
}

function DashboardPage() {
  const { data: reminders, isPending } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  const stats = useMemo(() => {
    if (!reminders) return null;

    const now = new Date();
    const upcoming = reminders.filter(
      (r) => new Date(r.date) > now && r.is_active
    );
    const past = reminders.filter((r) => new Date(r.date) <= now);
    const active = reminders.filter((r) => r.is_active);
    const recurring = reminders.filter((r) => r.is_recurring);

    // Group by month
    const byMonth = reminders.reduce(
      (acc, r) => {
        const month = new Date(r.date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      upcoming,
      past,
      active,
      recurring,
      total: reminders.length,
      byMonth,
    };
  }, [reminders]);

  if (isPending) {
    return (
      <div className="DashboardPage">
        <div className="DashboardPage__loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="DashboardPage">
      <h1 className="DashboardPage__title">Dashboard</h1>

      <div className="DashboardPage__stats">
        <StatCard title="Total Reminders" value={stats?.total || 0} />
        <StatCard title="Upcoming" value={stats?.upcoming.length || 0} />
        <StatCard title="Active" value={stats?.active.length || 0} />
        <StatCard title="Past" value={stats?.past.length || 0} />
        <StatCard title="Recurring" value={stats?.recurring.length || 0} />
      </div>

      {stats && Object.keys(stats.byMonth).length > 0 && (
        <div className="DashboardPage__section">
          <h2 className="DashboardPage__section-title">Reminders by Month</h2>
          <div className="DashboardPage__months">
            {Object.entries(stats.byMonth)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([month, count]) => (
                <div key={month} className="DashboardPage__month-item">
                  <span className="DashboardPage__month-label">{month}</span>
                  <span className="DashboardPage__month-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});
