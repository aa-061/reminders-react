import "./ReminderForm.css";
import { useState } from "react";
import { ICreateReminder, TCreateReminderField } from "@/types";

var returnedNewReminder = {
  id: 34,
  title: "Buy gifts from amazon 22434343",
  date: "2026-27-30T04:58:47.231Z",
  reminders: [{ mode: "email", address: "dev7c4@gmail.com" }],
  alerts: [1000],
  is_recurring: false,
  description: "This is a reminder to go and buy a bunch of gifts from amazon",
};

var reminderCreate = {
  title: "Buy gifts from amazon 22434343",
  date: "2026-27-30T04:58:47.231Z",
  reminders: [{ mode: "email", address: "dev7c4@gmail.com" }],
  alerts: [1000],
  is_recurring: false,
  description: "This is a reminder to go and buy a bunch of gifts from amazon",
};

export default () => {
  const [formState, setFormState] = useState<ICreateReminder>({
    title: "",
    date: "",
    reminders: [{ mode: "email", address: "dev7c4@gmail.com" }],
    alerts: [1000],
    is_recurring: false,
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: TCreateReminderField,
    type?: string,
  ) {
    const newFormState = { ...formState };
    if (type && type === "checkbox") {
      newFormState[field] = (e.target as HTMLInputElement).checked as never;
    } else {
      newFormState[field] = e.target.value as never;
    }
    setFormState(newFormState);
  }

  console.log("formState = ", formState);

  return (
    <div
      className="ReminderForm"
      style={{ border: "2px solid cyan", padding: "10px", margin: "10px" }}
    >
      <form method="POST" className="ReminderForm__form">
        <div className="form-group">
          <label htmlFor="reminder-title">Title</label>
          <input
            id="reminder-title"
            type="text"
            value={formState.title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-date">Date</label>
          <input
            id="reminder-date"
            type="date"
            value={formState.date}
            onChange={(e) => handleChange(e, "date")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-is-recurring">Recurring</label>
          <input
            id="reminder-is-recurring"
            type="checkbox"
            checked={formState.is_recurring}
            onChange={(e) => handleChange(e, "is_recurring", "checkbox")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-description">Recurring</label>
          <textarea
            id="reminder-description"
            value={formState.description}
            onChange={(e) => handleChange(e, "description")}
          ></textarea>
        </div>
      </form>
    </div>
  );
};
