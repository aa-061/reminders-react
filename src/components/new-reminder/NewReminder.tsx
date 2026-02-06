import "./NewReminder.css";
import ReminderForm from "@/components/reminder-form/ReminderForm";

export default () => {
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
