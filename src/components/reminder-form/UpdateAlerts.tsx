import "./UpdateAlerts.css";
import { useStore } from "@tanstack/react-store";
import { Ban, Check, CheckIcon, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AlertForm from "@/components/alert-form/AlertForm";
import DialogContent from "@/components/common/DialogContent";
import { alertPresets } from "@/lib/validation";
import { dialogStore, reminderFormStore } from "@/store";
import { useAlerts } from "@/hooks/useAlerts";

export default function UpdateAlerts({
  onDoneUpdatingAlerts,
}: {
  onDoneUpdatingAlerts: (newChecked: number[]) => void;
}) {
  const { alerts, deleteAlert, createAlert } = useAlerts();
  const reminderForm = useStore(reminderFormStore);
  const dialog = useStore(dialogStore);
  const [checkedAlerts, setCheckedAlerts] = useState<Record<number, boolean>>(
    {},
  );
  const [showAddForm, setShowAddForm] = useState(false);

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

  const toggleAlert = (id: number) => {
    setCheckedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDone = () => {
    const selectedIds = Object.entries(checkedAlerts)
      .filter(([, checked]) => checked)
      .map(([id]) => parseInt(id));
    onDoneUpdatingAlerts(selectedIds);
  };

  const handleClose = () => {
    dialogStore.setState({ ...dialog, children: null, isOpen: false });
  };

  const handleDelete = (id: number) => {
    deleteAlert(id);
    setCheckedAlerts((prev) => {
      const newChecked = { ...prev };
      delete newChecked[id];
      return newChecked;
    });
  };

  const addPresetAlert = (preset: (typeof alertPresets)[0]) => {
    const exists = alerts.some(
      (a) => a.ms === preset.ms && a.name === preset.name,
    );
    if (!exists) {
      createAlert({ name: preset.name, ms: preset.ms, isDefault: false });
    } else {
      const existingAlert = alerts.find(
        (a) => a.ms === preset.ms && a.name === preset.name,
      );
      if (existingAlert) {
        setCheckedAlerts((prev) => ({ ...prev, [existingAlert.id]: true }));
      }
    }
  };

  const selectedCount = Object.values(checkedAlerts).filter(Boolean).length;

  return (
    <DialogContent
      title="Select Alert Times"
      subtitle={`${selectedCount} alert${selectedCount !== 1 ? "s" : ""} selected`}
      onClose={handleClose}
      footer={
        <button type="button" className="btn" onClick={handleDone}>
          <CheckIcon /> Done
        </button>
      }
    >
      <div className="UpdateAlerts__presets">
        <h3 className="UpdateAlerts__presets-title">
          <Clock size={16} />
          Quick Add
        </h3>
        <div className="UpdateAlerts__preset-buttons">
          {alertPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="UpdateAlerts__preset-btn"
              onClick={() => addPresetAlert(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="UpdateAlerts__list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`UpdateAlerts__item ${checkedAlerts[alert.id] ? "UpdateAlerts__item--selected" : ""}`}
            >
              <button
                type="button"
                className="UpdateAlerts__item-main"
                onClick={() => toggleAlert(alert.id)}
              >
                <div className="UpdateAlerts__item-check">
                  {checkedAlerts[alert.id] && <Check size={16} />}
                </div>
                <span className="UpdateAlerts__item-name">{alert.name}</span>
              </button>
              <button
                type="button"
                className="UpdateAlerts__item-delete"
                onClick={() => handleDelete(alert.id)}
                aria-label="Delete alert"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="UpdateAlerts__empty">
          <p>No alerts configured yet.</p>
          <p className="UpdateAlerts__empty-hint">
            Use Quick Add above or add a custom alert below.
          </p>
        </div>
      )}

      <div className="UpdateAlerts__add-section">
        {showAddForm ? (
          <div className="UpdateAlerts__add-form">
            <AlertForm onSuccess={() => setShowAddForm(false)} />
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowAddForm(false)}
            >
              <Ban /> Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus /> Add Custom Alert
          </button>
        )}
      </div>
    </DialogContent>
  );
}
