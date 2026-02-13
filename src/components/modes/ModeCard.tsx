import "./ModeCard.css";
import { Mail, MessageSquare, Phone, Star } from "lucide-react";
import type { IMode } from "@/types";

interface ModeCardProps {
  mode: IMode;
  onEdit: (mode: IMode) => void;
  onDelete: (id: number) => void;
  onToggleDefault: (id: number, isDefault: boolean) => void;
}

const getModeIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case "email":
      return <Mail size={24} />;
    case "sms":
      return <MessageSquare size={24} />;
    case "call":
      return <Phone size={24} />;
    default:
      return <Mail size={24} />;
  }
};

export default function ModeCard({
  mode,
  onEdit,
  onDelete,
  onToggleDefault,
}: ModeCardProps) {
  return (
    <div className={`ModeCard ${mode.isDefault ? "ModeCard--default" : ""}`}>
      <div className="ModeCard__icon">{getModeIcon(mode.mode)}</div>

      <div className="ModeCard__content">
        <div className="ModeCard__header">
          <h3 className="ModeCard__title">{mode.mode}</h3>
          {mode.isDefault && (
            <span className="ModeCard__badge">
              <Star size={14} fill="currentColor" />
              Default
            </span>
          )}
        </div>
        <p className="ModeCard__address">{mode.address}</p>
      </div>

      <div className="ModeCard__actions">
        <button
          onClick={() => onToggleDefault(mode.id, !mode.isDefault)}
          className="ModeCard__action-btn"
          title={mode.isDefault ? "Remove default" : "Set as default"}
          type="button"
        >
          <Star size={20} fill={mode.isDefault ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => onEdit(mode)}
          className="ModeCard__action-btn"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(mode.id)}
          className="ModeCard__action-btn ModeCard__action-btn--danger"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
