import "./ReminderForm.css";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import AlertForm from "@/components/alert-form/AlertForm";
import { alertsStore, reminderFormStore } from "@/store";
import { Trash2 } from "lucide-react";

// import ModeForm from "../alert-form/ModeForm";

export default ({
  onDoneUpdatingAlerts,
}: {
  onDoneUpdatingAlerts: (newChecked: number[]) => void;
}) => {
  const alerts = useStore(alertsStore);
  const reminderForm = useStore(reminderFormStore);
  const [checkedAlerts, setCheckedAlerts] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    const newCheckedAlerts: Record<number, boolean> = {};

    alerts.forEach((alert) => {
      const isIncluded = reminderForm.alerts.includes(alert.id);
      if (isIncluded || checkedAlerts[alert.id]) {
        newCheckedAlerts[alert.id] = true;
      } else {
        newCheckedAlerts[alert.id] = false;
      }
    });
    setCheckedAlerts(newCheckedAlerts);
  }, [alerts]);

  const addRemoveAlerts = (id: number) => {
    const newCheckAlerts = { ...checkedAlerts };
    newCheckAlerts[id] = !newCheckAlerts[id];
    setCheckedAlerts(newCheckAlerts);
  };

  function handleDone() {
    const listOfCheckedAlerts = [];
    for (const key in checkedAlerts) {
      if (checkedAlerts[key] === true) {
        listOfCheckedAlerts.push(parseInt(key));
      }
    }
    onDoneUpdatingAlerts(listOfCheckedAlerts);

    const newCheckedAlerts: Record<number, boolean> = { ...checkedAlerts };
    Object.keys(setCheckedAlerts).forEach(
      (key) => (newCheckedAlerts[parseInt(key)] = false),
    );
  }

  return (
    <div className="UpdateModes">
      <AlertForm />
      <fieldset>
        <legend>Available alerts</legend>

        <div>
          {Object.keys(checkedAlerts)
            .map((id) => alerts.find((x) => x.id === parseInt(id)))
            .filter((x) => x !== undefined)
            .map((alert) => (
              <div key={alert.id}>
                <input
                  type="checkbox"
                  id={`alert-${alert.id}`}
                  name={`alert-${alert.id}`}
                  checked={checkedAlerts[alert.id]}
                  onChange={() => addRemoveAlerts(alert.id)}
                />
                <label htmlFor={`alert-${alert.id}`}>
                  {alert.name}
                  <button
                    onClick={() => {
                      let newAlerts = [...alerts];
                      newAlerts = newAlerts.filter((m) => m.id !== alert.id);
                      alertsStore.setState(newAlerts);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </label>
              </div>
            ))}
        </div>
      </fieldset>
      <button type="button" onClick={handleDone}>
        Done
      </button>
    </div>
  );
};
