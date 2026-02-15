import "./Misc.css";
import { useStore } from "@tanstack/react-store";
import { Moon, Sun } from "lucide-react";
import { themeStore } from "@/store";
import type { TTheme } from "@/types";

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

export const ThemeToggle = () => {
  const theme = useStore(themeStore);

  const toggleTheme = (): void => {
    const newTheme: TTheme = theme === "dark" ? "light" : "dark";
    themeStore.setState(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="ThemeToggle"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
