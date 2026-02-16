import "./AvailableModes.css";
import "./ReminderForm.css";
import { Bell, Mail, MessageSquare, Phone, Trash2 } from "lucide-react";
import { modesStore } from "@/store";
import type { IMode } from "@/types";
import Tile from "../common/Tile";

const getModeIcon = (mode: string) => {
  const lowerMode = mode.toLowerCase();
  if (lowerMode.includes("email")) return <Mail size={18} />;
  if (lowerMode.includes("sms")) return <MessageSquare size={18} />;
  if (lowerMode.includes("phone")) return <Phone size={18} />;
  return <Bell size={18} />;
};

export default ({
  checkedModes,
  modes,
  addRemoveModes,
}: {
  checkedModes: Record<number, boolean>;
  modes: IMode[];
  addRemoveModes: (id: number) => void;
}) => {
  const displayModes = Object.keys(checkedModes)
    .map((id) => modes.find((x) => x.id === parseInt(id)))
    .filter((x) => x !== undefined);

  return (
    <fieldset className="AvailableModes">
      <legend>Available modes</legend>

      <ul>
        {displayModes.map((mode) => (
          <li key={mode.id}>
            <Tile
              id={`mode-${mode.id}`}
              name={`mode-${mode.id}`}
              checked={checkedModes[mode.id]}
              onChange={() => addRemoveModes(mode.id)}
            >
              <label
                htmlFor={`mode-${mode.id}`}
                className="AvailableModes__label"
              >
                <span className="AvailableModes__icon">
                  {getModeIcon(mode.mode)}
                </span>
                <span className="AvailableModes__info">
                  <span className="AvailableModes__mode">{mode.mode}</span>
                  <span className="AvailableModes__address">
                    {mode.address}
                  </span>
                </span>
                <button
                  className="AvailableModes__delete"
                  type="button"
                  onClick={() => {
                    let newModes = [...modes];
                    newModes = newModes.filter((m) => m.id !== mode.id);
                    modesStore.setState(newModes);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </label>
            </Tile>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
