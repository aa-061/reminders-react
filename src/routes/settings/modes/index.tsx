import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import ModesList from "@/components/modes/ModesList";
import "./index.css";

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
