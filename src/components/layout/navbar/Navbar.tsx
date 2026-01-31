import "./Navbar.css";
import { useEffect, useState } from "react";
import NavLinks from "./NavLinks";

export default () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return savedTheme || (prefersDark ? "dark" : "light");
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="Navbar">
      <div className="Navbar__logo-container">{"\u{1F4C5}"}</div>
      <NavLinks />
      <div className="Navbar__nav-actions">
        <button onClick={toggleTheme} className="Navbar__theme-toggle">
          {theme === "light" ? "\u263E" : "\u263C"}
        </button>
      </div>
    </header>
  );
};
