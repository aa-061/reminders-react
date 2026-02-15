import "./index.css";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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
    <div className="RemindersPage">
      <div className="RemindersPage__header">
        <h1 className="RemindersPage__title">My Reminders</h1>
        <Link to="/reminders/new" className="btn">
          <Plus /> Add Reminder
        </Link>
      </div>
      <RemindersList />
    </div>
  );
}
