import "./Misc.css";

export const SwitchInput = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}) => {
  return (
    <div className="SwitchInput">
      <input
        className="SwitchInput__checkbox"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`SwitchInput__toggles ${checked ? "SwitchInput__checked" : ""}`}
      >
        <div className="SwitchInput__toggle SwitchInput__off">OFF</div>
        <div className="SwitchInput__toggle SwitchInput__on">ON</div>
      </div>
    </div>
  );
};
