import "./ModeForm.css";
import type { TModeField } from "@/types";
import { modeStore } from "../../store";

var returnedNewReminder = {
  id: 34,
  title: "Buy gifts from amazon 22434343",
  date: "2026-27-30T04:58:47.231Z",
  reminders: [{ mode: "email", address: "dev7c4@gmail.com" }],
  alerts: [1000],
  is_recurring: false,
  description: "This is a reminder to go and buy a bunch of gifts from amazon",
};

var reminderCreate = {
  title: "Buy gifts from amazon 22434343",
  date: "2026-27-30T04:58:47.231Z",
  reminders: [{ mode: "email", address: "dev7c4@gmail.com" }],
  alerts: [1000],
  is_recurring: false,
  description: "This is a reminder to go and buy a bunch of gifts from amazon",
};

export default ({
  addNewMode,
}: {
  addNewMode: ({ mode, address }: { mode: string; address: string }) => void;
}) => {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: TModeField,
  ) {
    const newFormState = { ...modeStore.state };
    newFormState[field] = e.target.value as never;
    modeStore.setState(newFormState);
  }

  function handleForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    addNewMode({
      mode: modeStore.state.mode,
      address: modeStore.state.address,
    });
  }

  console.log("ModeForm modeStore = ", modeStore.state);

  return (
    <div
      className="ModeForm"
      style={{ border: "2px solid pink", padding: "10px", margin: "10px" }}
    >
      <form onSubmit={handleForm} method="POST" className="ModeForm__form">
        <div className="form-group">
          <label htmlFor="reminder-mode">Mode</label>
          <select
            onChange={(e) => handleChange(e, "mode")}
            value={modeStore.state.mode}
            name="reminder_mode"
            className="custom-select"
          >
            <button>
              {/* @ts-ignore */}
              <selectedcontent></selectedcontent>
              <span className="chevron">▼</span>
            </button>
            <option value="email">
              <div className="option-content">
                <span>Email</span>
              </div>
            </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reminder-address">Address</label>
          <input
            id="reminder-address"
            type="text"
            value={modeStore.state.address}
            name="reminder_address"
            onChange={(e) => handleChange(e, "address")}
          />
        </div>
        <div className="form-group">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};
