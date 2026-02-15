import "./AlertForm.css";
import { useStore } from "@tanstack/react-store";
import { alertStore, alertsStore } from "@/store";
import type { TAlertField } from "@/types";
import AlertOptions from "./AlertOptions";

interface AlertFormProps {
  onSuccess?: () => void;
}

export default ({ onSuccess }: AlertFormProps = {}) => {
  const alerts = useStore(alertsStore);
  const alert = useStore(alertStore);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: TAlertField,
  ) {
    const newFormState = { ...alertStore.state };
    newFormState[field] = e.target.value as never;
    alertStore.setState(newFormState);
  }

  function handleForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const newAlerts = [...alerts];
    const id =
      newAlerts.length === 0 ? 1 : newAlerts[newAlerts.length - 1].id + 1;
    const newAlert = { id, name: alert.name, ms: alert.ms };
    newAlerts.push(newAlert);
    alertsStore.setState(newAlerts);
    alertStore.setState({
      id: 0,
      name: "",
      ms: 0,
    });

    if (onSuccess) {
      onSuccess();
    }
  }

  function updateAlertOptions(totalMs: number) {
    alertStore.setState((prevState) => ({
      ...prevState,
      ms: totalMs,
    }));
  }

  return (
    <div
      className="AlertForm"
      style={{ border: "2px solid red", padding: "10px", margin: "10px" }}
    >
      <h3>Add a new alert</h3>
      <form onSubmit={handleForm} method="POST" className="AlertForm__form">
        <div className="form-group">
          <label htmlFor="reminder-alert-name">Alert name</label>
          <input
            type="text"
            id="reminder-alert-name"
            name="reminder_alert_name"
            value={alert.name}
            onChange={(e) => handleChange(e, "name")}
          />
        </div>

        <AlertOptions updateAlertOptions={updateAlertOptions} />

        <div className="form-group">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};
