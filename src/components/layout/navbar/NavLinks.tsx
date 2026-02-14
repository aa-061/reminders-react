import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export default function NavLinks() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="NavLinks">
      <Link to="/" className="NavLinks__link">
        Home
      </Link>
      <Link to="/reminders" className="NavLinks__link">
        Reminders
      </Link>
      <Link to="/settings" className="NavLinks__link">
        Settings
      </Link>
    </nav>
  );
}
