import "./AlertForm.css";
import { useStore } from "@tanstack/react-store";
import { Save } from "lucide-react";
import { alertStore } from "@/store";
import type { TAlertField } from "@/types";
import AlertOptions from "./AlertOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "@/api/alerts";
import { useState } from "react";

interface AlertFormProps {
  onSuccess?: () => void;
}

export default ({ onSuccess }: AlertFormProps = {}) => {
  const queryClient = useQueryClient();
  const alert = useStore(alertStore);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      alertStore.setState({
        id: 0,
        name: "",
        ms: 0,
        isDefault: false,
      });
      setError("");
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      onSuccess?.();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    },
  });

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
    setError("");

    if (!alert.name.trim()) {
      setError("Please enter an alert name");
      return;
    }

    if (alert.ms <= 0) {
      setError("Please configure alert time");
      return;
    }

    mutation.mutate({ name: alert.name.trim(), ms: alert.ms, isDefault: false });
  }

  function updateAlertOptions(totalMs: number) {
    alertStore.setState((prevState) => ({
      ...prevState,
      ms: totalMs,
    }));
  }

  return (
    <div className="AlertForm">
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

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <button type="submit" className="btn" disabled={mutation.isPending}>
            <Save /> {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
