import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import RemindersList from "@/components/reminders-list/RemindersList";
import { authClient } from "@/lib/auth-client";
import "./index.css";

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
    <div className="RemindersPage">
      <div className="RemindersPage__header">
        <h1 className="RemindersPage__title">My Reminders</h1>
        <Link to="/reminders/new" className="RemindersPage__add-btn">
          + Add Reminder
        </Link>
      </div>
      <RemindersList />
    </div>
  );
}
