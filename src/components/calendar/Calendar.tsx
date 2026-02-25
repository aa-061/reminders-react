import "./Calendar.css";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IReminder } from "@/types";
import CalendarDay from "./CalendarDay";

interface CalendarProps {
  reminders: IReminder[];
  onDateClick: (date: Date) => void;
}

export default function Calendar({ reminders, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  const remindersByDate = useMemo(() => {
    const map = new Map<string, IReminder[]>();
    reminders.forEach((r) => {
      const dateKey = new Date(r.date).toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(r);
    });
    return map;
  }, [reminders]);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="Calendar">
      <div className="Calendar__header">
        <button onClick={prevMonth} className="btn btn--ghost btn--icon">
          <ChevronLeft size={20} />
        </button>
        <h2 className="Calendar__month">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={nextMonth} className="btn btn--ghost btn--icon">
          <ChevronRight size={20} />
        </button>
      </div>

      <button onClick={goToToday} className="btn btn--ghost btn--sm Calendar__today-btn">
        Today
      </button>

      <div className="Calendar__weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="Calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="Calendar__grid">
        {days.map((date, i) => (
          <CalendarDay
            key={i}
            date={date}
            reminders={date ? remindersByDate.get(date.toDateString()) || [] : []}
            onClick={() => date && onDateClick(date)}
          />
        ))}
      </div>
    </div>
  );
}
