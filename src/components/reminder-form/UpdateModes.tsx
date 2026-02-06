import "./ReminderForm.css";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { modesStore, reminderFormStore } from "@/store";
import ModeForm from "../mode-form/ModeForm";
import AvailableModes from "./AvailableModes";

export default ({
  onDoneUpdatingModes,
}: {
  onDoneUpdatingModes: (newChecked: number[]) => void;
}) => {
  const modes = useStore(modesStore);
  const reminderForm = useStore(reminderFormStore);
  const [checkedModes, setCheckedModes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const newCheckedModes: Record<number, boolean> = {};

    modes.forEach((mode) => {
      const isIncluded = reminderForm.reminders.includes(mode.id);
      if (isIncluded || checkedModes[mode.id]) {
        newCheckedModes[mode.id] = true;
      } else {
        newCheckedModes[mode.id] = false;
      }
    });
    setCheckedModes(newCheckedModes);
  }, [modes]);

  const addRemoveModes = (id: number) => {
    const newCheckModes = { ...checkedModes };
    newCheckModes[id] = !newCheckModes[id];
    setCheckedModes(newCheckModes);
  };

  function handleDone() {
    const listOfCheckedModes = [];
    for (const key in checkedModes) {
      if (checkedModes[key] === true) {
        listOfCheckedModes.push(parseInt(key));
      }
    }
    onDoneUpdatingModes(listOfCheckedModes);

    const newCheckedModes: Record<number, boolean> = { ...checkedModes };
    Object.keys(setCheckedModes).forEach(
      (key) => (newCheckedModes[parseInt(key)] = false),
    );
  }

  return (
    <div className="UpdateModes">
      <ModeForm />
      <AvailableModes
        addRemoveModes={addRemoveModes}
        checkedModes={checkedModes}
        modes={modes}
      />
      <button className="btn" type="button" onClick={handleDone}>
        Done
      </button>
    </div>
  );
};
