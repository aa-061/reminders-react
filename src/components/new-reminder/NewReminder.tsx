import "./NewReminder.css";
import { useStore } from "@tanstack/react-store";
import ModeForm from "@/components/mode-form/ModeForm";
import ModesTable from "@/components/modes-table/ModesTable";
import ReminderForm from "@/components/reminder-form/ReminderForm";
import { showAddNewModeFormStore } from "@/store";

export default () => {
  const showAddNewModeForm = useStore(showAddNewModeFormStore);

  return (
    <div className="NewReminder">
      <h1>Create new reminder</h1>
      {/* <ModesTable />
      {!showAddNewModeForm && (
        <button onClick={() => showAddNewModeFormStore.setState(true)}>
          Add new mode
        </button>
      )}
      {showAddNewModeForm && <ModeForm />} */}
      <ReminderForm />
    </div>
  );
};
