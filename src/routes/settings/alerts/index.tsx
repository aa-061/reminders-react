import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import AlertsList from "@/components/alerts/AlertsList";
import "./index.css";

export const Route = createFileRoute("/settings/alerts/")({
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
  component: SettingsAlertsPage,
});

function SettingsAlertsPage() {
  return (
    <div className="SettingsAlertsPage">
      <AlertsList />
    </div>
  );
}
