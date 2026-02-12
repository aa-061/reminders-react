import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import NavLinks from "@/components/layout/navbar/NavLinks";
import { useSession, signOut } from "@/lib/auth-client";
import { Calendar, Moon, Sun } from "lucide-react";

export default () => {
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
      <div className="Navbar__logo-container"><Calendar size={24} /></div>
      <NavLinks />
      <div className="Navbar__nav-actions">
        <button onClick={toggleTheme} className="Navbar__theme-toggle">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {session && (
          <>
            <span className="Navbar__user-email">{session.user.email}</span>
            <button onClick={handleLogout} className="Navbar__logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};
