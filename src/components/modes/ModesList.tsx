import "./ModesList.css";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useModes } from "@/hooks/useModes";
import ModeCard from "./ModeCard";
import ModeFormDialog from "./ModeFormDialog";
import type { IMode, IModeFormData } from "@/types";

export default function ModesList() {
  const { modes, isPending, error, createMode, updateMode, deleteMode } = useModes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<IMode | null>(null);

  const handleOpenCreate = () => {
    setEditingMode(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (mode: IMode) => {
    setEditingMode(mode);
    setIsDialogOpen(true);
  };

  const handleSave = (data: IModeFormData) => {
    if (editingMode) {
      updateMode({ id: editingMode.id, data });
    } else {
      createMode(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this mode?")) {
      deleteMode(id);
    }
  };

  const handleToggleDefault = (id: number, isDefault: boolean) => {
    updateMode({ id, data: { isDefault } });
  };

  if (isPending) {
    return (
      <div className="ModesList">
        <div className="ModesList__loading">Loading modes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ModesList">
        <div className="ModesList__error">
          <p>Failed to load modes</p>
          <p className="ModesList__error-message">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ModesList">
      <div className="ModesList__header">
        <div>
          <h2 className="ModesList__title">Notification Modes</h2>
          <p className="ModesList__subtitle">
            Manage how you receive reminder notifications
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn ModesList__add-btn" type="button">
          <Plus size={20} />
          Add Mode
        </button>
      </div>

      {modes.length === 0 ? (
        <div className="ModesList__empty">
          <p>No notification modes configured</p>
          <p className="ModesList__empty-hint">
            Add your first mode to start receiving reminders
          </p>
        </div>
      ) : (
        <div className="ModesList__grid">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onToggleDefault={handleToggleDefault}
            />
          ))}
        </div>
      )}

      <ModeFormDialog
        mode={editingMode}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
