import { createFileRoute } from "@tanstack/react-router";
import NewReminder from "@/components/new-reminder/NewReminder";

export const Route = createFileRoute("/reminders/new/")({
  component: NewReminderPage,
});

function NewReminderPage() {
  return <NewReminder />;
}
