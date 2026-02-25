import "./ReminderCard.css";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit2,
  Mail,
  MoreVertical,
  Pause,
  Play,
  Share2,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState, useRef, type TouchEvent } from "react";
import type { IReminder } from "@/types";

interface ReminderCardProps {
  reminder: IReminder;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export default function ReminderCard({
  reminder,
  onDelete,
  onToggleActive,
  isSelected,
  onToggleSelect,
}: ReminderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Swipe-to-delete state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const SWIPE_THRESHOLD = 100;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 120));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > SWIPE_THRESHOLD) {
      if (window.confirm("Delete this reminder?")) {
        onDelete(reminder.id);
      }
    }
    setSwipeOffset(0);
    setIsSwiping(false);
  };

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

  const handleSyncToCalendar = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/google/sync/${reminder.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        // Open Google Calendar event
        window.open(data.htmlLink, "_blank");
      } else if (data.requiresReauth) {
        // Redirect to settings to reconnect
        window.location.href = "/settings/integrations?google_reauth=true";
      } else {
        console.error("Failed to sync:", data.error);
      }
    } catch (error) {
      console.error("Failed to sync to calendar:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCheckboxChange = () => {
    onToggleSelect(reminder.id);
  };

  const handleCopyTitle = async () => {
    await navigator.clipboard.writeText(reminder.title);
    setShowQuickActions(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reminder.title,
          text: `Reminder: ${reminder.title} - ${formatDate(reminder.date)}`,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `Reminder: ${reminder.title} - ${formatDate(reminder.date)}`
      );
    }
    setShowQuickActions(false);
  };

  return (
    <div className="ReminderCard__wrapper">
      <div className="ReminderCard__swipe-action">
        <Trash2 size={24} />
      </div>
      <div
        className={`ReminderCard ${isPast ? "ReminderCard--past" : ""} ${isUpcoming ? "ReminderCard--upcoming" : ""} ${!reminder.is_active ? "ReminderCard--inactive" : ""} ${isSelected ? "ReminderCard--selected" : ""} ${isSwiping ? "ReminderCard--swiping" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(-${swipeOffset}px)` }}
      >
        <div className="ReminderCard__header">
        <div className="ReminderCard__title-section">
          <label className="ReminderCard__checkbox-wrapper">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="ReminderCard__checkbox"
              aria-label={`Select ${reminder.title}`}
            />
            <span className="ReminderCard__checkbox-custom"></span>
          </label>
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
            className="ReminderCard__action-btn btn btn--ghost btn--icon"
            title="Edit"
          >
            <Edit2 size={20} className="ReminderCard__icon" />
          </Link>
          <button
            onClick={handleSyncToCalendar}
            className="ReminderCard__action-btn btn btn--ghost btn--icon"
            title="Sync to Google Calendar"
            disabled={isSyncing}
          >
            <Calendar size={20} className="ReminderCard__icon" />
          </button>
          <button
            onClick={handleToggleActive}
            className="ReminderCard__action-btn btn btn--ghost btn--icon"
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
            className="ReminderCard__action-btn ReminderCard__action-btn--delete btn btn--ghost btn--icon"
            title="Delete"
          >
            <Trash2 size={20} className="ReminderCard__icon" />
          </button>

          {/* Quick actions dropdown */}
          <div className="ReminderCard__quick-actions">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="ReminderCard__action-btn btn btn--ghost btn--icon"
              aria-label="More actions"
            >
              <MoreVertical size={20} className="ReminderCard__icon" />
            </button>
            {showQuickActions && (
              <div className="ReminderCard__dropdown">
                <button onClick={handleCopyTitle}>
                  <Copy size={16} /> Copy title
                </button>
                <button onClick={handleShare}>
                  <Share2 size={16} /> Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail preview */}
      {reminder.image_url && (
        <div className="ReminderCard__thumbnail">
          <img
            src={reminder.image_url}
            alt=""
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

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
            className="btn btn--ghost"
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
    </div>
  );
}
