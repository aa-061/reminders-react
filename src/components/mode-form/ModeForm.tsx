import "./ModeForm.css";
import { useStore } from "@tanstack/react-store";
import { modeStore, modesStore } from "@/store";
import type { TModeField } from "@/types";
import { ChevronDown } from "lucide-react";

export default () => {
  const mode = useStore(modeStore);
  const modes = useStore(modesStore);

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

    const newModes = [...modes];
    const id = newModes.length === 0 ? 1 : newModes[newModes.length - 1].id + 1;
    const newMode = { id, mode: mode.mode, address: mode.address };
    newModes.push(newMode);
    modesStore.setState(newModes);
    modeStore.setState({
      id: 0,
      mode: "email",
      address: "",
    });
  }

  return (
    <div className="ModeForm">
      <h3>Add a new mode</h3>
      <form onSubmit={handleForm} method="POST" className="ModeForm__form">
        <div className="form-group">
          <label htmlFor="reminder-mode">Mode</label>
          <select
            onChange={(e) => handleChange(e, "mode")}
            value={mode.mode}
            name="reminder_mode"
            className="custom-select"
          >
            <button>
              {/* @ts-ignore */}
              <selectedcontent></selectedcontent>
              <ChevronDown size={20} className="chevron" />
            </button>
            <option value="email">
              <div className="option-content">
                <span>Email</span>
              </div>
            </option>
            <option value="sms">
              <div className="option-content">
                <span>Text</span>
              </div>
            </option>
            <option value="call">
              <div className="option-content">
                <span>Call</span>
              </div>
            </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reminder-address">Address</label>
          <input
            id="reminder-address"
            type="text"
            value={mode.address}
            name="reminder_address"
            onChange={(e) => handleChange(e, "address")}
          />
        </div>
        <div className="form-group">
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
