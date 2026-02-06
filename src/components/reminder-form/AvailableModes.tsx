import "./ReminderForm.css";
import { modesStore } from "@/store";
import type { IMode } from "@/types";
import Tile from "../common/Tile";

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
              <label htmlFor={`mode-${mode.id}`}>
                {mode.mode} @ {mode.address}{" "}
                <button
                  onClick={() => {
                    let newModes = [...modes];
                    newModes = newModes.filter((m) => m.id !== mode.id);
                    modesStore.setState(newModes);
                  }}
                >
                  {"\u0078"}
                </button>
              </label>
            </Tile>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
