import { z } from "zod";

export const reminderFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  date: z.string().min(1, "Date is required"),
  reminders: z
    .array(z.number())
    .min(1, "At least one notification mode is required"),
  alerts: z.array(z.number()).min(1, "At least one alert is required"),
  is_recurring: z.boolean(),
  recurrence: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  location: z
    .string()
    .max(500, "Location must be 500 characters or less")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
});

export type ReminderFormData = z.infer<typeof reminderFormSchema>;

// For edit mode, we don't need to validate that date is in the future
export const createReminderSchema = reminderFormSchema.refine(
  (data) => {
    if (!data.date) return true;
    const selectedDate = new Date(data.date);
    const now = new Date();
    return selectedDate > now;
  },
  {
    message: "Date must be in the future",
    path: ["date"],
  },
);

// Alert preset configuration (for better UX)
export const alertPresets = [
  { id: -1, name: "5 minutes before", ms: 5 * 60 * 1000 },
  { id: -2, name: "15 minutes before", ms: 15 * 60 * 1000 },
  { id: -3, name: "30 minutes before", ms: 30 * 60 * 1000 },
  { id: -4, name: "1 hour before", ms: 60 * 60 * 1000 },
  { id: -5, name: "1 day before", ms: 24 * 60 * 60 * 1000 },
  { id: -6, name: "1 week before", ms: 7 * 24 * 60 * 60 * 1000 },
];

// Recurrence frequency options
export const recurrenceFrequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom (Cron)" },
];
