import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import RemindersList from "@/components/reminders-list/RemindersList";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/reminders/")({
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
  component: RemindersPage,
});

function RemindersPage() {
  return (
    <>
      <p>Home component</p>
      <Link to="/reminders/new">Add new reminder</Link>
      <RemindersList />
    </>
  );
}
