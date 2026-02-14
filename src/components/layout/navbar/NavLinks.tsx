import "./NavLinks.css";
import { Link, useRouterState } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export default function NavLinks() {
  const { data: session } = useSession();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  if (!session) return null;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <nav className="NavLinks">
      <Link
        to="/"
        className={`NavLinks__link ${isActive("/") ? "NavLinks__link--active" : ""}`}
      >
        Home
      </Link>
      <Link
        to="/reminders"
        className={`NavLinks__link ${isActive("/reminders") ? "NavLinks__link--active" : ""}`}
      >
        Reminders
      </Link>
      <Link
        to="/settings"
        className={`NavLinks__link ${isActive("/settings") ? "NavLinks__link--active" : ""}`}
      >
        Settings
      </Link>
    </nav>
  );
}
