import "./RecurrenceConfig.css";
import { recurrenceFrequencies } from "@/lib/validation";
import type { ICreateReminder } from "@/types";

// Helper function to convert ISO string to local date format (YYYY-MM-DD)
function isoToLocalDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface RecurrenceConfigProps {
  isRecurring: boolean;
  recurrence: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  onRecurrenceChange: (field: keyof ICreateReminder, value: string) => void;
}

export default function RecurrenceConfig({
  isRecurring,
  recurrence,
  startDate,
  endDate,
  onRecurrenceChange,
}: RecurrenceConfigProps) {
  if (!isRecurring) return null;

  return (
    <div className="RecurrenceConfig">
      <h3 className="RecurrenceConfig__title">Recurrence Settings</h3>

      <div className="RecurrenceConfig__group">
        <label htmlFor="recurrence-frequency">Frequency</label>
        <select
          id="recurrence-frequency"
          value={recurrence || "daily"}
          onChange={(e) => onRecurrenceChange("recurrence", e.target.value)}
        >
          {recurrenceFrequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
      </div>

      {recurrence === "custom" && (
        <div className="RecurrenceConfig__group">
          <label htmlFor="cron-expression">Cron Expression</label>
          <input
            id="cron-expression"
            type="text"
            placeholder="0 9 * * 1-5"
            value={recurrence || ""}
            onChange={(e) => onRecurrenceChange("recurrence", e.target.value)}
          />
          <small className="RecurrenceConfig__hint">
            Example: "0 9 * * 1-5" runs at 9 AM on weekdays
          </small>
        </div>
      )}

      <div className="RecurrenceConfig__group">
        <label htmlFor="start-date">Start Date (Optional)</label>
        <input
          id="start-date"
          type="date"
          value={startDate ? isoToLocalDate(startDate) : ""}
          onChange={(e) =>
            onRecurrenceChange(
              "start_date",
              e.target.value ? new Date(e.target.value).toISOString() : "",
            )
          }
        />
      </div>

      <div className="RecurrenceConfig__group">
        <label htmlFor="end-date">End Date (Optional)</label>
        <input
          id="end-date"
          type="date"
          value={endDate ? isoToLocalDate(endDate) : ""}
          onChange={(e) =>
            onRecurrenceChange(
              "end_date",
              e.target.value ? new Date(e.target.value).toISOString() : "",
            )
          }
        />
      </div>

      {recurrence && recurrence !== "custom" && (
        <div className="RecurrenceConfig__preview">
          <h4>Next Occurrences:</h4>
          <p className="RecurrenceConfig__hint">
            This reminder will repeat {recurrence}
          </p>
        </div>
      )}
    </div>
  );
}
