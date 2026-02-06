import { Store } from "@tanstack/store";
import {
  type IAlert,
  type ICreateReminder,
  type IDialog,
  type IMode,
} from "@/types";

export const modeStore = new Store<IMode>({
  id: 0,
  mode: "email",
  address: "",
});

export const modesStore = new Store<IMode[]>([
  {
    id: 1,
    mode: "email",
    address: "aaa7c4@gmail.com",
  },
]);
export const showAddNewModeFormStore = new Store<boolean>(false);

export const reminderFormStore = new Store<ICreateReminder>({
  title: "",
  date: "",
  reminders: [],
  alerts: [],
  is_recurring: false,
  description: "",
});

export const dialogStore = new Store<IDialog>({
  isOpen: false,
  onClose: () => {},
  children: null,
});

export const alertStore = new Store<IAlert>({
  id: 0,
  name: "",
  ms: 0,
});

export const alertsStore = new Store<IAlert[]>([
  {
    id: 1,
    name: "1 second",
    ms: 1000,
  },
]);
