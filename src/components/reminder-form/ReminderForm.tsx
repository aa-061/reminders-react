import "./ReminderForm.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import {
  alertsStore,
  dialogStore,
  modesStore,
  reminderFormStore,
} from "@/store";
import { type IAugmentedReminder, type TCreateReminderField } from "@/types";
import { SwitchInput } from "../common/Misc";
import UpdateAlerts from "./UpdateAlerts";
import UpdateModes from "./UpdateModes";

export default () => {
  const queryClient = useQueryClient();
  const reminderForm = useStore(reminderFormStore);
  const dialog = useStore(dialogStore);
  const modes = useStore(modesStore);
  const alerts = useStore(alertsStore);

  const url = import.meta.env.VITE_SERVER_URL;

  if (!url)
    throw new Error(
      "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
    );

  const { mutate, isPending } = useMutation({
    mutationFn: async (newAugmentedReminder: IAugmentedReminder) => {
      const response = await fetch(`${url}/reminders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAugmentedReminder),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      reminderFormStore.setState({
        title: "",
        date: "",
        reminders: [],
        alerts: [],
        is_recurring: false,
        description: "",
      });
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
    const augmentedNewReminder: IAugmentedReminder = {
      ...reminderForm,
      reminders: modes.map((m) => ({
        mode: m.mode,
        address: m.address,
      })),
      alerts: alerts.map((a) => ({ id: a.id.toString(), time: a.ms })),
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
          <label htmlFor="reminder-title">Title</label>
          <input
            id="reminder-title"
            type="text"
            value={reminderForm.title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-date">Date</label>
          <input
            id="reminder-date"
            type="datetime-local"
            value={reminderForm.date ? reminderForm.date.slice(0, 16) : ""}
            onChange={(e) => handleChange(e, "date", "date")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-is-recurring">Recurring</label>
          <SwitchInput
            id="reminder-is-recurring"
            checked={reminderForm.is_recurring}
            onChange={(e) => handleChange(e, "is_recurring", "checkbox")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-description">Description</label>
          <textarea
            id="reminder-description"
            value={reminderForm.description}
            onChange={(e) => handleChange(e, "description")}
          ></textarea>
        </div>
        <div className="form-group">
          <h3>Reminder modes</h3>
          <button className="btn" type="button" onClick={handleUpdateModes}>
            Update modes
          </button>
          {reminderForm.reminders.length <= 0 ? (
            <p>No added modes</p>
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
                          x
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </div>
        <div className="form-group">
          <h3>Alerts</h3>
          <button className="btn" type="button" onClick={handleUpdateAlerts}>
            Update alerts
          </button>
          {reminderForm.alerts.length <= 0 ? (
            <p>No added alerts</p>
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
                          x
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </div>

        <div className="form-group">
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
