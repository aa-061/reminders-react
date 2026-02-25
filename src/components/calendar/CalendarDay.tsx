import type { IReminder } from "@/types";

interface CalendarDayProps {
  date: Date | null;
  reminders: IReminder[];
  onClick: () => void;
}

export default function CalendarDay({
  date,
  reminders,
  onClick,
}: CalendarDayProps) {
  if (!date) {
    return <div className="CalendarDay CalendarDay--empty" />;
  }

  const isToday = date.toDateString() === new Date().toDateString();
  const hasReminders = reminders.length > 0;

  return (
    <button
      className={`CalendarDay ${isToday ? "CalendarDay--today" : ""} ${hasReminders ? "CalendarDay--has-reminders" : ""}`}
      onClick={onClick}
    >
      <span className="CalendarDay__number">{date.getDate()}</span>
      {hasReminders && (
        <div className="CalendarDay__dots">
          {reminders.slice(0, 3).map((r) => (
            <span key={r.id} className="CalendarDay__dot" />
          ))}
        </div>
      )}
    </button>
  );
}
