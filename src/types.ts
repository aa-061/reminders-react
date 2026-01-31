export interface IMode {
  id: number;
  mode: string;
  address: string;
}

export type TModeField = keyof IMode;

export interface IReminderMode {
  mode: string;
  address: string;
}

export interface ICreateReminder {
  title: string;
  date: string;
  reminders: IReminderMode[];
  alerts: number[];
  is_recurring: boolean;
  description: string;
}

export type TCreateReminderField = keyof ICreateReminder;
