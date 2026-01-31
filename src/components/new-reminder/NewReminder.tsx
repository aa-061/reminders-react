// import ModesTable from "../modes-table/ModesTable";
import "./NewReminder.css";
import { modesStore, showAddNewModeFormStore } from "@/store";
import ModeForm from "../mode-form/ModeForm";
import ReminderForm from "../reminder-form/ReminderForm";

export default () => {
  function addNewMode({ mode, address }: { mode: string; address: string }) {
    const newModes = [...modesStore.state];
    const id = newModes.length === 0 ? 1 : newModes[newModes.length - 1].id + 1;
    const newMode = { id, mode, address };
    newModes.push(newMode);
    modesStore.setState(newModes);
  }

  return (
    <div className="NewReminder">
      {/* <ModesTable />  */}
      {!showAddNewModeFormStore.state && (
        <button onClick={() => showAddNewModeFormStore.setState(true)}>
          Add new mode
        </button>
      )}
      {showAddNewModeFormStore.state && <ModeForm addNewMode={addNewMode} />}
      <ReminderForm />
    </div>
  );
};
