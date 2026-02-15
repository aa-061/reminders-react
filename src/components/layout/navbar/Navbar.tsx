import "./Navbar.css";
import { Link, useNavigate } from "@tanstack/react-router";
import { Calendar, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import NavLinks from "@/components/layout/navbar/NavLinks";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();
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

  const handleLogout = async (): Promise<void> => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="Navbar">
      <div className="Navbar__left">
        <Link to="/" className="Navbar__logo">
          <Calendar size={24} />
          <span className="Navbar__logo-text">Reminders</span>
        </Link>
        <NavLinks />
      </div>
      <div className="Navbar__right">
        <button
          onClick={toggleTheme}
          className="Navbar__icon-btn"
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {session && (
          <>
            <span className="Navbar__user-email">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="btn btn--secondary"
              aria-label="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
