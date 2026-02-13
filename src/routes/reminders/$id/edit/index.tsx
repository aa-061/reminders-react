import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { useReminder } from "@/hooks/useReminder";
import ReminderForm from "@/components/reminder-form/ReminderForm";
import "./edit.css";

export const Route = createFileRoute("/reminders/$id/edit/")({
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
  component: EditReminderPage,
});

function EditReminderPage() {
  const { id } = Route.useParams();
  const { data: reminder, isLoading, error } = useReminder(id);

  if (isLoading) {
    return (
      <div className="EditReminderPage">
        <div className="EditReminderPage__loading">Loading reminder...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="EditReminderPage">
        <div className="EditReminderPage__error">
          <h1>Error loading reminder</h1>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  if (!reminder) {
    return (
      <div className="EditReminderPage">
        <div className="EditReminderPage__error">
          <h1>Reminder not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="EditReminderPage">
      <h1>Edit Reminder</h1>
      <ReminderForm editMode={true} existingReminder={reminder} />
    </div>
  );
}
