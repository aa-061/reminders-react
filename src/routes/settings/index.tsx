import "./index.css";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { Bell, MessageSquare } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/settings/")({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="SettingsPage">
      <div className="SettingsPage__container">
        <h1 className="SettingsPage__title">Settings</h1>
        <p className="SettingsPage__subtitle">
          Manage your notification preferences and alert configurations
        </p>

        <div className="SettingsPage__grid">
          <Link to="/settings/modes" className="SettingsPage__card">
            <div className="SettingsPage__card-icon">
              <MessageSquare size={32} />
            </div>
            <h2 className="SettingsPage__card-title">Notification Modes</h2>
            <p className="SettingsPage__card-description">
              Configure how you receive reminders (email, SMS, call)
            </p>
          </Link>

          <Link to="/settings/alerts" className="SettingsPage__card">
            <div className="SettingsPage__card-icon">
              <Bell size={32} />
            </div>
            <h2 className="SettingsPage__card-title">Alert Presets</h2>
            <p className="SettingsPage__card-description">
              Set when you want to be notified before reminders
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
