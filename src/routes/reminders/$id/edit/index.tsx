import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

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

  return (
    <div style={{ padding: "var(--spacing-xl)" }}>
      <h1>Edit Reminder {id}</h1>
      <p>Edit functionality will be implemented in Phase 4.</p>
      <Link to="/reminders">Back to Reminders List</Link>
    </div>
  );
}
