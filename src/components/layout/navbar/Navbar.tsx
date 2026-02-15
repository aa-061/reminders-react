import "./Navbar.css";
import { Link, useNavigate } from "@tanstack/react-router";
import { Calendar, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/common/Misc";
import NavLinks from "@/components/layout/navbar/NavLinks";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();

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
        <ThemeToggle />
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
