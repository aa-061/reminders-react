import "./MobileNav.css";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/Misc";
import { signOut, useSession } from "@/lib/auth-client";

export default function MobileNav() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  function toggleMobileMenu(): void {
    setShowMenu(!showMenu);
  }

  function closeMenu(): void {
    setShowMenu(false);
  }

  const handleLogout = async (): Promise<void> => {
    await signOut();
    setShowMenu(false);
    navigate({ to: "/login" });
  };

  return (
    <footer className="MobileNav">
      <ThemeToggle />
      <div className="MobileNav__content">
        {showMenu && (
          <>
            <div className="MobileNav__menu-backdrop" onClick={closeMenu} />
            <nav className="MobileNav__menu">
              <ul>
                <li>
                  <Link
                    className="MobileNav__link btn btn--secondary"
                    to="/"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                </li>
                {session ? (
                  <>
                    <li>
                      <Link
                        className="MobileNav__link btn btn--secondary"
                        to="/reminders"
                        onClick={closeMenu}
                      >
                        Reminders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="MobileNav__link btn btn--secondary"
                        to="/reminders/new"
                        onClick={closeMenu}
                      >
                        New Reminder
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="MobileNav__link btn btn--secondary"
                        to="/settings"
                        onClick={closeMenu}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="MobileNav__button btn btn--secondary"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      className="MobileNav__link btn btn--secondary"
                      to="/login"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </>
        )}

        <button
          onClick={toggleMobileMenu}
          className="MobileNav__burger-menu-button btn"
          aria-label={showMenu ? "Close menu" : "Open menu"}
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </footer>
  );
}
