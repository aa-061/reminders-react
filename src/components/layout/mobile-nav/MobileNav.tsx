import "./MobileNav.css";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import MobileNavLinks from "@/components/layout/mobile-nav/MobileNavLinks";

// export default () => {
//   const [theme, setTheme] = useState(() => {
//     if (typeof window === "undefined") return "light";
//     const savedTheme = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia(
//       "(prefers-color-scheme: dark)",
//     ).matches;
//     return savedTheme || (prefersDark ? "dark" : "light");
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     root.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = (): void => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   return (
//     <footer className="MobileNav">
//       <div className="Navbar__logo-container">{"\u{1F4C5}"}</div>
//       <MobileNavLinks />
//       <div className="Navbar__nav-actions">
//         <button onClick={toggleTheme} className="Navbar__theme-toggle">
//           {theme === "light" ? "\u263E" : "\u263C"}
//         </button>
//       </div>
//     </footer>
//   );
// };
export default () => {
  const [showMenu, setShowMenu] = useState(false);

  function toggleMobileMenu(): void {
    setShowMenu(!showMenu);
  }

  return (
    <footer className="MobileNav">
      <div className="MobileNav__content">
        {showMenu && (
          <nav>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/reminders">List of reminders</Link>
              </li>
              <li>
                <Link to="/reminders/new">Create new reminder</Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
        )}

        <button
          onClick={toggleMobileMenu}
          className="MobileNav__burger-menu-button"
        >
          ☰
        </button>
      </div>
    </footer>
  );
};
