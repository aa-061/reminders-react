import "./AlertCard.css";
import { Clock, Star } from "lucide-react";
import type { IAlert } from "@/types";
import { formatTimeFromMs } from "@/utils/time";

interface AlertCardProps {
  alert: IAlert;
  onEdit: (alert: IAlert) => void;
  onDelete: (id: number) => void;
  onToggleDefault: (id: number, isDefault: boolean) => void;
}

export default function AlertCard({
  alert,
  onEdit,
  onDelete,
  onToggleDefault,
}: AlertCardProps) {
  return (
    <div
      className={`AlertCard ${alert.isDefault ? "AlertCard--default" : ""}`}
    >
      <div className="AlertCard__icon">
        <Clock size={24} />
      </div>

      <div className="AlertCard__content">
        <div className="AlertCard__header">
          <h3 className="AlertCard__title">{alert.name}</h3>
          {alert.isDefault && (
            <span className="AlertCard__badge">
              <Star size={14} fill="currentColor" />
              Default
            </span>
          )}
        </div>
        <p className="AlertCard__time">{formatTimeFromMs(alert.ms)} before</p>
      </div>

      <div className="AlertCard__actions">
        <button
          onClick={() => onToggleDefault(alert.id, !alert.isDefault)}
          className="AlertCard__action-btn"
          title={alert.isDefault ? "Remove default" : "Set as default"}
          type="button"
        >
          <Star size={20} fill={alert.isDefault ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => onEdit(alert)}
          className="AlertCard__action-btn"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(alert.id)}
          className="AlertCard__action-btn AlertCard__action-btn--danger"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
