import "./AlertCard.css";
import { Clock } from "lucide-react";
import type { IAlert } from "@/types";
import { formatTimeFromMs } from "@/utils/time";

interface AlertCardProps {
  alert: IAlert;
  onEdit: (alert: IAlert) => void;
  onDelete: (id: number) => void;
}

export default function AlertCard({ alert, onEdit, onDelete }: AlertCardProps) {
  return (
    <div className="AlertCard">
      <div className="AlertCard__icon">
        <Clock size={24} />
      </div>

      <div className="AlertCard__content">
        <h3 className="AlertCard__title">{alert.name}</h3>
        <p className="AlertCard__time">{formatTimeFromMs(alert.ms)} before</p>
      </div>

      <div className="AlertCard__actions">
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
