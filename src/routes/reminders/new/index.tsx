import { createFileRoute, redirect } from "@tanstack/react-router";
import NewReminder from "@/components/new-reminder/NewReminder";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/reminders/new/")({
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
  component: NewReminderPage,
});

function NewReminderPage() {
  return <NewReminder />;
}
