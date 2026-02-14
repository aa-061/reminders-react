import "./AlertsList.css";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import AlertCard from "./AlertCard";
import AlertFormDialog from "./AlertFormDialog";
import type { IAlert } from "@/types";

export default function AlertsList() {
  const { alerts, isPending, error, createAlert, updateAlert, deleteAlert } = useAlerts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<IAlert | null>(null);

  const handleOpenCreate = () => {
    setEditingAlert(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (alert: IAlert) => {
    setEditingAlert(alert);
    setIsDialogOpen(true);
  };

  const handleSave = (data: { name: string; ms: number }) => {
    if (editingAlert) {
      updateAlert({ id: editingAlert.id, data });
    } else {
      createAlert(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      deleteAlert(id);
    }
  };

  if (isPending) {
    return (
      <div className="AlertsList">
        <div className="AlertsList__loading">Loading alerts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="AlertsList">
        <div className="AlertsList__error">
          <p>Failed to load alerts</p>
          <p className="AlertsList__error-message">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="AlertsList">
      <div className="AlertsList__header">
        <div>
          <h2 className="AlertsList__title">Alert Presets</h2>
          <p className="AlertsList__subtitle">
            Configure when you want to receive reminder notifications
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn AlertsList__add-btn" type="button">
          <Plus size={20} />
          Add Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="AlertsList__empty">
          <p>No alert presets configured</p>
          <p className="AlertsList__empty-hint">
            Add your first alert to customize notification timing
          </p>
        </div>
      ) : (
        <div className="AlertsList__grid">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AlertFormDialog
        alert={editingAlert}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
