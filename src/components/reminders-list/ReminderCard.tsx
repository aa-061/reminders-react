import "./ReminderCard.css";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Mail,
  Pause,
  Play,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { IReminder } from "@/types";

interface ReminderCardProps {
  reminder: IReminder;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
}

export default function ReminderCard({
  reminder,
  onDelete,
  onToggleActive,
}: ReminderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const reminderDate = new Date(reminder.date);
  const now = new Date();
  const isPast = reminderDate < now;
  const isUpcoming = !isPast && reminder.is_active;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatAlertTime = (milliseconds: number) => {
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (days >= 1) return `${Math.floor(days)}d before`;
    if (hours >= 1) return `${Math.floor(hours)}h before`;
    if (minutes >= 1) return `${Math.floor(minutes)}m before`;
    return `${Math.floor(seconds)}s before`;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      onDelete(reminder.id);
    }
  };

  const handleToggleActive = () => {
    onToggleActive(reminder.id, !reminder.is_active);
  };

  return (
    <div
      className={`ReminderCard ${isPast ? "ReminderCard--past" : ""} ${isUpcoming ? "ReminderCard--upcoming" : ""} ${!reminder.is_active ? "ReminderCard--inactive" : ""}`}
    >
      <div className="ReminderCard__header">
        <div className="ReminderCard__title-section">
          <h3 className="ReminderCard__title">{reminder.title}</h3>
          <div className="ReminderCard__badges">
            {reminder.is_recurring && (
              <span className="ReminderCard__badge ReminderCard__badge--recurring">
                Recurring
              </span>
            )}
            {!reminder.is_active && (
              <span className="ReminderCard__badge ReminderCard__badge--inactive">
                Inactive
              </span>
            )}
            {isPast && (
              <span className="ReminderCard__badge ReminderCard__badge--past">
                Past
              </span>
            )}
          </div>
        </div>
        <div className="ReminderCard__actions">
          <Link
            to="/reminders/$id/edit"
            params={{ id: reminder.id.toString() }}
            className="ReminderCard__action-btn btn--ghost btn--icon"
            title="Edit"
          >
            <Edit2 size={20} className="ReminderCard__icon" />
          </Link>
          <button
            onClick={handleToggleActive}
            className="ReminderCard__action-btn btn--ghost btn--icon"
            title={reminder.is_active ? "Deactivate" : "Activate"}
          >
            {reminder.is_active ? (
              <Pause size={20} className="ReminderCard__icon" />
            ) : (
              <Play size={20} className="ReminderCard__icon" />
            )}
          </button>
          <button
            onClick={handleDelete}
            className="ReminderCard__action-btn ReminderCard__action-btn--delete btn--ghost btn--icon"
            title="Delete"
          >
            <Trash2 size={20} className="ReminderCard__icon" />
          </button>
        </div>
      </div>

      <div className="ReminderCard__info">
        <div className="ReminderCard__date">
          <span className="ReminderCard__label">Date:</span>
          <span>{formatDate(reminder.date)}</span>
        </div>
        {reminder.location && (
          <div className="ReminderCard__location">
            <span className="ReminderCard__label">Location:</span>
            <span>{reminder.location}</span>
          </div>
        )}
      </div>

      <div className="ReminderCard__modes">
        <span className="ReminderCard__label">Notification modes:</span>
        <div className="ReminderCard__modes-list">
          {reminder.reminders.map((mode, idx) => (
            <span key={`${mode.id}-${idx}`} className="ReminderCard__mode">
              {mode.mode === "email" && (
                <Mail size={18} className="ReminderCard__icon" />
              )}
              {mode.mode === "sms" && (
                <Smartphone size={18} className="ReminderCard__icon" />
              )}
              {mode.mode === "push" && (
                <Bell size={18} className="ReminderCard__icon" />
              )}
              {mode.mode === "ical" && (
                <Calendar size={18} className="ReminderCard__icon" />
              )}
              <span>{mode.address}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="ReminderCard__alerts">
        <span className="ReminderCard__label">
          Alerts ({reminder.alerts.length}):
        </span>
        <div className="ReminderCard__alerts-list">
          {reminder.alerts.slice(0, 3).map((alert, idx) => (
            <span key={`${alert.id}-${idx}`} className="ReminderCard__alert">
              {formatAlertTime(alert.time)}
            </span>
          ))}
          {reminder.alerts.length > 3 && (
            <span className="ReminderCard__alert-more">
              +{reminder.alerts.length - 3} more
            </span>
          )}
        </div>
      </div>

      {reminder.description && (
        <div className="ReminderCard__description-section">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ReminderCard__expand-btn btn--ghost"
          >
            <span className="ReminderCard__expand-text">
              {isExpanded ? "Hide details" : "Show details"}
            </span>
            {isExpanded ? (
              <ChevronUp size={18} className="ReminderCard__icon" />
            ) : (
              <ChevronDown size={18} className="ReminderCard__icon" />
            )}
          </button>
          {isExpanded && (
            <p className="ReminderCard__description">{reminder.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
