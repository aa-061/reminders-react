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

// Phone validation using E.164 international format
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const modeFormSchema = z
  .object({
    mode: z.enum(["email", "sms", "call"], {
      message: "Please select a valid mode",
    }),
    address: z.string().min(1, "Address is required"),
    isDefault: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.mode === "email") {
        return z.string().email().safeParse(data.address).success;
      }
      if (data.mode === "sms" || data.mode === "call") {
        return phoneRegex.test(data.address);
      }
      return true;
    },
    {
      message: "Invalid format for selected mode type",
      path: ["address"],
    },
  );

export type ModeFormData = z.infer<typeof modeFormSchema>;

// Alert form validation
export const alertFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  value: z.number().min(1, "Value must be at least 1"),
  unit: z.enum(["seconds", "minutes", "hours", "days", "weeks"]),
});

export type AlertFormData = z.infer<typeof alertFormSchema>;
