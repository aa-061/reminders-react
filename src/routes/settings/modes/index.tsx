import "./index.css";
import { createFileRoute, redirect } from "@tanstack/react-router";
import ModesList from "@/components/modes/ModesList";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/settings/modes/")({
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
  component: SettingsModesPage,
});

function SettingsModesPage() {
  return (
    <div className="SettingsModesPage">
      <ModesList />
    </div>
  );
}
