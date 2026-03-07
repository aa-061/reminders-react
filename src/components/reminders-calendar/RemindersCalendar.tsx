import "./RemindersCalendar.css";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { IReminder } from "@/types";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

interface RemindersCalendarProps {
  reminders?: IReminder[];
}

export default function RemindersCalendar({
  reminders: externalReminders,
}: RemindersCalendarProps) {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_SERVER_URL;
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: fetchedReminders, isPending } = useQuery<IReminder[]>({
    queryKey: ["reminders"],
    queryFn: () =>
      fetch(`${url}/reminders`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json()),
    enabled: !externalReminders,
  });

  const reminders = externalReminders ?? fetchedReminders ?? [];

  const events: CalendarEvent[] = useMemo(() => {
    return reminders.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      start: new Date(reminder.date),
      end: new Date(reminder.date),
    }));
  }, [reminders]);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      navigate({
        to: "/reminders/$id/edit",
        params: { id: event.id.toString() },
      });
    },
    [navigate],
  );

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  if (isPending && !externalReminders) {
    return (
      <div className="RemindersCalendar">
        <div className="RemindersCalendar__header">
          <h2 className="RemindersCalendar__title">Calendar</h2>
        </div>
        <div className="RemindersCalendar__loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="RemindersCalendar">
      <div className="RemindersCalendar__header">
        <h2 className="RemindersCalendar__title">Calendar</h2>
      </div>
      <div className="RemindersCalendar__container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onNavigate={handleNavigate}
          date={currentDate}
          views={["month"] as View[]}
          defaultView="month"
          popup
          selectable={false}
        />
      </div>
    </div>
  );
}
