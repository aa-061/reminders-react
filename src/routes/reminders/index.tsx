import { Link, createFileRoute } from "@tanstack/react-router";
import RemindersList from "@/components/reminders-list/RemindersList";

export const Route = createFileRoute("/reminders/")({
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
