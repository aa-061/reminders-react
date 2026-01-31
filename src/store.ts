import { Store } from "@tanstack/store";
import { IMode } from "./types";

export const modeStore = new Store<IMode>({
  id: 0,
  mode: "email",
  address: "",
});

export const modesStore = new Store<IMode[]>([]);
export const showAddNewModeFormStore = new Store<boolean>(false);
