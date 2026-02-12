import "./MobileNav.css";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";

export default () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  function toggleMobileMenu(): void {
    setShowMenu(!showMenu);
  }

  const handleLogout = async (): Promise<void> => {
    await signOut();
    setShowMenu(false);
    navigate({ to: "/login" });
  };

  return (
    <footer className="MobileNav">
      <div className="MobileNav__content">
        {showMenu && (
          <nav className="MobileNav__menu">
            {session && (
              <div className="MobileNav__user-info">
                <span className="MobileNav__user-email">{session.user.email}</span>
              </div>
            )}
            <ul>
              <li>
                <Link to="/" onClick={() => setShowMenu(false)}>
                  Home
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <Link to="/reminders" onClick={() => setShowMenu(false)}>
                      List of reminders
                    </Link>
                  </li>
                  <li>
                    <Link to="/reminders/new" onClick={() => setShowMenu(false)}>
                      Create new reminder
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="MobileNav__logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setShowMenu(false)}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        <button
          onClick={toggleMobileMenu}
          className="MobileNav__burger-menu-button"
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </footer>
  );
};
