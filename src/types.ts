import type { ReactNode } from "react";

export type ModeType = "email" | "sms" | "call" | "push" | "ical" | "telegram";

export interface IMode {
  id: number;
  mode: ModeType;
  address: string;
  isDefault: boolean;
}

export type TModeField = keyof IMode;

export interface IModeFormData {
  mode: ModeType;
  address: string;
  isDefault: boolean;
}

export interface IReminderMode {
  mode: string;
  address: string;
}

export interface ICreateReminder {
  title: string;
  date: string;
  reminders: number[];
  alerts: number[];
  is_recurring: boolean;
  recurrence?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  description: string;
}

export interface IAugmentedReminder {
  title: string;
  date: string;
  reminders: { mode: string; address: string }[];
  alerts: { id: string; time: number }[];
  is_recurring: boolean;
  recurrence?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  description: string;
}

export interface IReminder {
  id: number;
  title: string;
  date: string;
  location: string | null;
  description: string;
  reminders: { id: string; mode: string; address: string }[];
  alerts: { id: string; time: number }[];
  is_recurring: boolean;
  recurrence: string | null;
  start_date: string | null;
  end_date: string | null;
  last_alert_time: string | null;
  is_active?: boolean;
}

export type TCreateReminderField = keyof ICreateReminder;

export interface IDialog {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLDialogElement>) => void;
  children: ReactNode;
}

export interface IAlert {
  id: number;
  name: string;
  ms: number;
  isDefault: boolean;
}

export type TAlertField = keyof IAlert;

export interface IAlertFormData {
  name: string;
  ms: number;
  isDefault: boolean;
}

export type TTheme = "light" | "dark";
