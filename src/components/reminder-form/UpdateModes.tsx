import "./UpdateModes.css";
import { useStore } from "@tanstack/react-store";
import {
  Ban,
  Check,
  CheckIcon,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import DialogContent from "@/components/common/DialogContent";
import ModeForm from "@/components/mode-form/ModeForm";
import { dialogStore, modesStore, reminderFormStore } from "@/store";

export default function UpdateModes({
  onDoneUpdatingModes,
}: {
  onDoneUpdatingModes: (newChecked: number[]) => void;
}) {
  const modes = useStore(modesStore);
  const reminderForm = useStore(reminderFormStore);
  const dialog = useStore(dialogStore);
  const [checkedModes, setCheckedModes] = useState<Record<number, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const newCheckedModes: Record<number, boolean> = {};
    modes.forEach((mode) => {
      const isIncluded = reminderForm.reminders.includes(mode.id);
      if (isIncluded || checkedModes[mode.id]) {
        newCheckedModes[mode.id] = true;
      } else {
        newCheckedModes[mode.id] = false;
      }
    });
    setCheckedModes(newCheckedModes);
  }, [modes]);

  const toggleMode = (id: number) => {
    setCheckedModes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDone = () => {
    const selectedIds = Object.entries(checkedModes)
      .filter(([, checked]) => checked)
      .map(([id]) => parseInt(id));
    onDoneUpdatingModes(selectedIds);
  };

  const handleClose = () => {
    dialogStore.setState({ ...dialog, children: null, isOpen: false });
  };

  const handleDelete = (id: number) => {
    const newModes = modes.filter((m) => m.id !== id);
    modesStore.setState(newModes);
    setCheckedModes((prev) => {
      const newChecked = { ...prev };
      delete newChecked[id];
      return newChecked;
    });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "email":
        return <Mail size={18} />;
      case "sms":
        return <MessageSquare size={18} />;
      case "call":
        return <Phone size={18} />;
      case "telegram":
        return <Send size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  const selectedCount = Object.values(checkedModes).filter(Boolean).length;

  return (
    <DialogContent
      title="Select Notification Modes"
      subtitle={`${selectedCount} mode${selectedCount !== 1 ? "s" : ""} selected`}
      onClose={handleClose}
      footer={
        <button type="button" className="btn" onClick={handleDone}>
          <CheckIcon /> Done
        </button>
      }
    >
      {modes.length > 0 ? (
        <div className="UpdateModes__list">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`UpdateModes__item ${checkedModes[mode.id] ? "UpdateModes__item--selected" : ""}`}
            >
              <button
                type="button"
                className="UpdateModes__item-main"
                onClick={() => toggleMode(mode.id)}
              >
                <div className="UpdateModes__item-check">
                  {checkedModes[mode.id] && <Check size={16} />}
                </div>
                <div className="UpdateModes__item-icon">
                  {getModeIcon(mode.mode)}
                </div>
                <div className="UpdateModes__item-info">
                  <span className="UpdateModes__item-type">{mode.mode}</span>
                  <span className="UpdateModes__item-address">
                    {mode.address}
                  </span>
                </div>
              </button>
              <button
                type="button"
                className="UpdateModes__item-delete"
                onClick={() => handleDelete(mode.id)}
                aria-label="Delete mode"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="UpdateModes__empty">
          <p>No notification modes configured yet.</p>
          <p className="UpdateModes__empty-hint">
            Add a mode below to get started.
          </p>
        </div>
      )}

      <div className="UpdateModes__add-section">
        {showAddForm ? (
          <div className="UpdateModes__add-form">
            <ModeForm onSuccess={() => setShowAddForm(false)} />
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
            <Plus /> Add New Mode
          </button>
        )}
      </div>
    </DialogContent>
  );
}
