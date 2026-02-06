import "./Misc.css";
import type { ReactNode } from "react";

export default ({
  id,
  name,
  checked,
  onChange,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  children: ReactNode;
}) => {
  return (
    <div className="Tile">
      <input
        className="Tile__checkbox"
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      {children}
    </div>
  );
};
