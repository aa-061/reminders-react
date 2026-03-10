import "./index.css";
import { createFileRoute, redirect } from "@tanstack/react-router";
import GoogleCalendarSettings from "@/components/google-calendar-settings/GoogleCalendarSettings";
import IcsUpload from "@/components/ics-upload/IcsUpload";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/settings/integrations/")({
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
  component: SettingsIntegrationsPage,
});

function SettingsIntegrationsPage() {
  return (
    <div className="SettingsIntegrationsPage">
      <div className="SettingsIntegrationsPage__container">
        <h1 className="SettingsIntegrationsPage__title">Integrations</h1>
        <p className="SettingsIntegrationsPage__subtitle">
          Connect third-party services to enhance your reminder experience
        </p>

        <div className="SettingsIntegrationsPage__content">
          <IcsUpload />
          <GoogleCalendarSettings />
        </div>
      </div>
    </div>
  );
}
