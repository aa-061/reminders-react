import "./ReminderForm.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { showToast } from "@/components/common/ToastContainer";
import { createReminderSchema, reminderFormSchema } from "@/lib/validation";
import {
  alertsStore,
  dialogStore,
  modesStore,
  reminderFormStore,
} from "@/store";
import {
  type IAugmentedReminder,
  type IReminder,
  type TCreateReminderField,
} from "@/types";
import { SwitchInput } from "../common/Misc";
import RecurrenceConfig from "./RecurrenceConfig";
import UpdateAlerts from "./UpdateAlerts";
import UpdateModes from "./UpdateModes";

interface ReminderFormProps {
  editMode?: boolean;
  existingReminder?: IReminder;
}

export default ({ editMode = false, existingReminder }: ReminderFormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const reminderForm = useStore(reminderFormStore);
  const dialog = useStore(dialogStore);
  const modes = useStore(modesStore);
  const alerts = useStore(alertsStore);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const url = import.meta.env.VITE_SERVER_URL;

  if (!url)
    throw new Error(
      "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
    );

  // Pre-populate form in edit mode
  useEffect(() => {
    if (editMode && existingReminder) {
      reminderFormStore.setState({
        title: existingReminder.title,
        date: existingReminder.date,
        reminders: existingReminder.reminders
          .filter((r) => r.id !== undefined && r.id !== null)
          .map((r) => parseInt(r.id, 10)),
        alerts: existingReminder.alerts
          .filter((a) => a.id !== undefined && a.id !== null)
          .map((a) => parseInt(a.id, 10)),
        is_recurring: existingReminder.is_recurring,
        recurrence: existingReminder.recurrence,
        start_date: existingReminder.start_date,
        end_date: existingReminder.end_date,
        location: existingReminder.location,
        description: existingReminder.description || "",
      });
    }
  }, [editMode, existingReminder]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (newAugmentedReminder: IAugmentedReminder) => {
      const endpoint = editMode
        ? `${url}/reminders/${existingReminder?.id}`
        : `${url}/reminders`;
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAugmentedReminder),
      });
      if (!response.ok)
        throw new Error(editMode ? "Failed to update" : "Failed to create");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      if (editMode && existingReminder) {
        queryClient.invalidateQueries({
          queryKey: ["reminder", existingReminder.id],
        });
      }

      showToast(
        editMode
          ? "Reminder updated successfully!"
          : "Reminder created successfully!",
        "success",
      );

      // Reset form only in create mode
      if (!editMode) {
        reminderFormStore.setState({
          title: "",
          date: "",
          reminders: [],
          alerts: [],
          is_recurring: false,
          recurrence: null,
          start_date: null,
          end_date: null,
          location: null,
          description: "",
        });
      }

      // Navigate to reminders list
      navigate({ to: "/reminders" });
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error",
      );
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: TCreateReminderField,
    type?: string,
  ) {
    const newFormState = { ...reminderForm };
    if (type && type === "checkbox") {
      newFormState[field] = (e.target as HTMLInputElement).checked as never;
    } else if (type && type === "date") {
      newFormState[field] = new Date(e.target.value).toISOString() as never;
    } else {
      newFormState[field] = e.target.value as never;
    }
    reminderFormStore.setState(newFormState);

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function handleRecurrenceChange(field: TCreateReminderField, value: string) {
    const newFormState = { ...reminderForm };
    newFormState[field] = value as never;
    reminderFormStore.setState(newFormState);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function onDoneUpdatingModes(listOfCheckedModes: number[]) {
    dialogStore.setState({ ...dialog, isOpen: false });

    reminderFormStore.setState({
      ...reminderForm,
      reminders: listOfCheckedModes,
    });
  }

  function onDoneUpdatingAlerts(listOfCheckedAlerts: number[]) {
    dialogStore.setState({ ...dialog, isOpen: false });

    reminderFormStore.setState({
      ...reminderForm,
      alerts: listOfCheckedAlerts,
    });
  }

  function handleUpdateModes() {
    dialogStore.setState({
      ...dialog,
      isOpen: true,
      children: <UpdateModes onDoneUpdatingModes={onDoneUpdatingModes} />,
    });
  }

  function handleUpdateAlerts() {
    dialogStore.setState({
      ...dialog,
      isOpen: true,
      children: <UpdateAlerts onDoneUpdatingAlerts={onDoneUpdatingAlerts} />,
    });
  }

  console.log("reminderForm = ", reminderForm);

  /*
  {
    "title": "Buy gifts from amazon 22434343",
    "date": "2026-27-30T04:58:47.231Z", 
    "reminders": [{"mode": "email", "address": "dev7c4@gmail.com"}], 
    "alerts": [1000],
    "is_recurring": false,
    "description": "This is a reminder to go and buy a bunch of gifts from amazon"
}
  */

  function handleCreateNewReminder(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate form data
    const schema = editMode ? reminderFormSchema : createReminderSchema;
    const validation = schema.safeParse(reminderForm);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(fieldErrors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const augmentedNewReminder: IAugmentedReminder = {
      ...reminderForm,
      reminders: modes
        .filter((m) => reminderForm.reminders.includes(m.id))
        .map((m) => ({
          mode: m.mode,
          address: m.address,
        })),
      alerts: alerts
        .filter((a) => reminderForm.alerts.includes(a.id))
        .map((a) => ({ id: a.id.toString(), time: a.ms })),
    };

    mutate(augmentedNewReminder);
  }

  return (
    <div className="ReminderForm">
      <form
        method="POST"
        className="ReminderForm__form"
        onSubmit={handleCreateNewReminder}
      >
        <div className="form-group">
          <label htmlFor="reminder-title">
            Title <span className="required">*</span>
          </label>
          <input
            id="reminder-title"
            type="text"
            value={reminderForm.title}
            onChange={(e) => handleChange(e, "title")}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="reminder-date">
            Date & Time <span className="required">*</span>
          </label>
          <input
            id="reminder-date"
            type="datetime-local"
            value={reminderForm.date ? reminderForm.date.slice(0, 16) : ""}
            onChange={(e) => handleChange(e, "date", "date")}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="reminder-location">Location (Optional)</label>
          <input
            id="reminder-location"
            type="text"
            placeholder="Enter a location"
            value={reminderForm.location || ""}
            onChange={(e) => handleChange(e, "location")}
            className={errors.location ? "input-error" : ""}
          />
          {errors.location && (
            <span className="error-message">{errors.location}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="reminder-is-recurring">Recurring</label>
          <SwitchInput
            id="reminder-is-recurring"
            checked={reminderForm.is_recurring}
            onChange={(e) => handleChange(e, "is_recurring", "checkbox")}
          />
        </div>
        <RecurrenceConfig
          isRecurring={reminderForm.is_recurring}
          recurrence={reminderForm.recurrence}
          startDate={reminderForm.start_date}
          endDate={reminderForm.end_date}
          onRecurrenceChange={handleRecurrenceChange}
        />
        <div className="form-group">
          <label htmlFor="reminder-description">Description (Optional)</label>
          <textarea
            id="reminder-description"
            value={reminderForm.description}
            rows={5}
            onChange={(e) => handleChange(e, "description")}
            className={errors.description ? "input-error" : ""}
          ></textarea>
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>
        <div className="form-group">
          <h3>
            Reminder modes <span className="required">*</span>
          </h3>
          <button
            className="btn btn--secondary"
            type="button"
            onClick={handleUpdateModes}
          >
            Update modes
          </button>
          {reminderForm.reminders.length <= 0 ? (
            <p className="info-text">No added modes</p>
          ) : (
            <>
              <p>Added modes:</p>
              <ul>
                {reminderForm.reminders
                  .map((id) => modes.find((x) => x.id === id))
                  .filter((x) => x !== undefined)
                  .map((mode) => {
                    return (
                      <li key={mode.id}>
                        {mode.mode} @ {mode.address}{" "}
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            reminderFormStore.setState((prevState) => {
                              return {
                                ...prevState,
                                reminders: reminderForm.reminders.filter(
                                  (x) => x !== mode.id,
                                ),
                              };
                            });
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
          {errors.reminders && (
            <span className="error-message">{errors.reminders}</span>
          )}
        </div>
        <div className="form-group">
          <h3>
            Alerts <span className="required">*</span>
          </h3>
          <button
            className="btn btn--secondary"
            type="button"
            onClick={handleUpdateAlerts}
          >
            Update alerts
          </button>
          {reminderForm.alerts.length <= 0 ? (
            <p className="info-text">No added alerts</p>
          ) : (
            <>
              <p>Added alerts:</p>
              <ul>
                {reminderForm.alerts
                  .map((id) => alerts.find((x) => x.id === id))
                  .filter((x) => x !== undefined)
                  .map((alert) => {
                    return (
                      <li key={alert.id}>
                        {alert.name}
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            reminderFormStore.setState((prevState) => {
                              return {
                                ...prevState,
                                alerts: reminderForm.alerts.filter(
                                  (x) => x !== alert.id,
                                ),
                              };
                            });
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
          {errors.alerts && (
            <span className="error-message">{errors.alerts}</span>
          )}
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="spinner" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{editMode ? "Update Reminder" : "Create Reminder"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
