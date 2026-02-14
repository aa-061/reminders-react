# UI Polish Implementation Plan

This document contains a comprehensive plan for implementing "Phase 8: Responsive Design & CSS Polish" for the Reminders client application. Each phase is designed to be independently executable by other agents.

**Important**: All code provided is complete and ready to copy. Agents should only need to copy the code and update/create the specified files.

**Important**: Make sure to implement the exact same code as described in this file. Once you finish, reply with a git commit message. I want a comprehensive git commit message text. DO NOT git commit yourself because I still need to validate your work. I will copy your message and paste it into commit command myself. The commit message must be one sentence only!

---

## Summary of Issues Identified

From the UI analysis and screenshots:

1. **Horizontal scroll bug** - `width: 100vw` in Layout.css doesn't account for scrollbar
2. **Dialog z-index issue** - Mobile menu (z-index: 100) overlays dialogs
3. **Desktop navbar is sparse** - No app name, no nav links visible when logged in
4. **Footer is placeholder** - Just shows "Footer component" text
5. **Inconsistent button styles** - Multiple button patterns used
6. **Hardcoded colors** - Some CSS uses hex colors instead of variables
7. **SwitchInput uses px units** - Should use rem per CLAUDE.md
8. **UpdateModes/UpdateAlerts dialogs** - Raw, unstyled form elements
9. **Form input borders inconsistent** - Some black, some gray
10. **React Query DevTools visible** - Tropical island icon in corner

---

## Phase 1: Fix Critical Layout Issues

**Goal**: Fix the horizontal scroll and dialog z-index issues

### 1.1 Fix Layout.css (Horizontal Scroll)

**File**: `src/components/layout/Layout.css`

**Issue**: `width: 100vw` causes horizontal scroll because it doesn't account for scrollbar width.

**Replace entire file with**:

```css
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.Layout main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 48rem) {
  .Layout main {
    padding: var(--spacing-xl);
  }
}

@media (min-width: 64rem) {
  .Layout main {
    padding: var(--spacing-2xl);
  }
}
```

### 1.2 Fix Dialog z-index

**File**: `src/components/common/Dialog.css`

**Issue**: Dialog needs higher z-index than mobile menu (which is z-index: 100)

**Replace entire file with**:

```css
.Dialog {
  border: none;
  border-radius: var(--radius-lg);
  padding: 0;
  max-width: min(90vw, 31.25rem);
  max-height: 85vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;

  /* Animation for opening */
  animation: Dialog__slideIn var(--transition-base) ease-out;
}

.Dialog::backdrop {
  background: var(--backdrop-opacity);
  backdrop-filter: var(--backdrop-blur);
  animation: Dialog__fadeIn var(--transition-base) ease-out;
  z-index: 999;
}

.Dialog__content {
  padding: var(--spacing-xl);
}

.Dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

.Dialog__header h2 {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  margin: 0;
}

.Dialog__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  color: var(--secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.Dialog__close:hover {
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}

.Dialog__body {
  margin-bottom: var(--spacing-xl);
}

.Dialog__footer {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

/* Animations */
@keyframes Dialog__slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(-1rem) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
}

@keyframes Dialog__fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Closing animation - requires JS support */
.Dialog[closing] {
  animation: Dialog__slideOut var(--transition-base) ease-in;
}

.Dialog[closing]::backdrop {
  animation: Dialog__fadeOut var(--transition-base) ease-in;
}

@keyframes Dialog__slideOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(-1rem) scale(0.95);
  }
}

@keyframes Dialog__fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Mobile adjustments */
@media (max-width: 30rem) {
  .Dialog {
    max-width: 95vw;
    max-height: 90vh;
  }

  .Dialog__content {
    padding: var(--spacing-lg);
  }

  .Dialog__footer {
    flex-direction: column;
  }

  .Dialog__footer button {
    width: 100%;
  }
}
```

### 1.3 Fix MobileNav z-index

**File**: `src/components/layout/mobile-nav/MobileNav.css`

**Issue**: Mobile nav z-index should be lower than dialogs.

**Replace entire file with**:

```css
.MobileNav {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
  place-content: center;
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  width: 100%;
  box-sizing: border-box;
}

.MobileNav__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--spacing-sm);
  place-items: center;
  box-sizing: border-box;
}

.MobileNav__menu {
  position: fixed;
  bottom: 5rem;
  left: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  box-sizing: border-box;
  z-index: 51;
  animation: MobileNav__slideUp var(--transition-base) ease-out;
}

@keyframes MobileNav__slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.MobileNav__menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--backdrop-opacity);
  z-index: 49;
}

.MobileNav__user-info {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-sm);
  text-align: center;
}

.MobileNav__user-email {
  font-size: var(--fs-sm);
  color: var(--secondary);
}

.MobileNav nav ul {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: var(--spacing-sm);
  box-sizing: border-box;
}

.MobileNav nav ul li {
  display: flex;
}

.MobileNav nav ul li .MobileNav__link,
.MobileNav nav ul li .MobileNav__button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.MobileNav nav ul li .MobileNav__link:hover,
.MobileNav nav ul li .MobileNav__button:hover {
  background-color: var(--primary-hover);
}

.MobileNav__burger-menu-button {
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border: none;
  padding: var(--spacing-lg);
  font-size: var(--fs-xl);
  border-radius: var(--radius-full);
  cursor: pointer;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-button);
  transition: background-color var(--transition-base);
}

.MobileNav__burger-menu-button:hover {
  background-color: var(--primary-hover);
}

@media (min-width: 48rem) {
  .MobileNav {
    display: none;
  }
}
```

### 1.4 Update MobileNav.tsx to add backdrop

**File**: `src/components/layout/mobile-nav/MobileNav.tsx`

**Replace entire file with**:

```tsx
import "./MobileNav.css";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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
      <div className="MobileNav__content">
        {showMenu && (
          <>
            <div className="MobileNav__menu-backdrop" onClick={closeMenu} />
            <nav className="MobileNav__menu">
              <ul>
                <li>
                  <Link className="MobileNav__link" to="/" onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                {session ? (
                  <>
                    <li>
                      <Link
                        className="MobileNav__link"
                        to="/reminders"
                        onClick={closeMenu}
                      >
                        Reminders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="MobileNav__link"
                        to="/reminders/new"
                        onClick={closeMenu}
                      >
                        New Reminder
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="MobileNav__link"
                        to="/settings"
                        onClick={closeMenu}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="MobileNav__button">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      className="MobileNav__link"
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
          className="MobileNav__burger-menu-button"
          aria-label={showMenu ? "Close menu" : "Open menu"}
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </footer>
  );
}
```

---

## Phase 2: Desktop View Polish

**Goal**: Fix the desktop navbar and footer to look professional

### 2.1 Update Navbar.tsx

**File**: `src/components/layout/navbar/Navbar.tsx`

**Replace entire file with**:

```tsx
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import NavLinks from "@/components/layout/navbar/NavLinks";
import { useSession, signOut } from "@/lib/auth-client";
import { Calendar, Moon, Sun, LogOut } from "lucide-react";

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
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {session && (
          <>
            <span className="Navbar__user-email">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="Navbar__logout-btn"
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
```

### 2.2 Update Navbar.css

**File**: `src/components/layout/navbar/Navbar.css`

**Replace entire file with**:

```css
.Navbar {
  display: none;
}

@media (min-width: 48rem) {
  .Navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-2xl);
    background-color: light-dark(var(--surface-light), var(--surface-dark));
    border-bottom: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .Navbar__left {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xl);
  }

  .Navbar__logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-decoration: none;
    color: light-dark(var(--foreground-light), var(--foreground-dark));
    transition: opacity var(--transition-fast);
  }

  .Navbar__logo:hover {
    opacity: 0.8;
  }

  .Navbar__logo-text {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
  }

  .Navbar__right {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .Navbar__icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    color: light-dark(var(--foreground-light), var(--foreground-dark));
    transition: background-color var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .Navbar__icon-btn:hover {
    background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  }

  .Navbar__user-email {
    font-size: var(--fs-sm);
    color: var(--secondary);
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Navbar__logout-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    background-color: transparent;
    border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
    color: light-dark(var(--foreground-light), var(--foreground-dark));
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    transition: all var(--transition-fast);
  }

  .Navbar__logout-btn:hover {
    background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
    border-color: var(--primary);
  }
}
```

### 2.3 Update NavLinks.tsx

**File**: `src/components/layout/navbar/NavLinks.tsx`

**Replace entire file with**:

```tsx
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
```

### 2.4 Create NavLinks.css

**File**: `src/components/layout/navbar/NavLinks.css`

**Create new file with**:

```css
.NavLinks {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.NavLinks__link {
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--secondary);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.NavLinks__link:hover {
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}

.NavLinks__link--active {
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}
```

### 2.5 Update Footer.tsx

**File**: `src/components/layout/footer/Footer.tsx`

**Replace entire file with**:

```tsx
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="Footer">
      <div className="Footer__content">
        <p className="Footer__copyright">
          &copy; {currentYear} Reminders App
        </p>
        <p className="Footer__tagline">
          Never forget what matters
        </p>
      </div>
    </footer>
  );
}
```

### 2.6 Update Footer.css

**File**: `src/components/layout/footer/Footer.css`

**Replace entire file with**:

```css
.Footer {
  display: none;
}

@media (min-width: 48rem) {
  .Footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-2xl);
    background-color: light-dark(var(--surface-light), var(--surface-dark));
    border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  }

  .Footer__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .Footer__copyright {
    font-size: var(--fs-sm);
    color: var(--secondary);
    margin: 0;
  }

  .Footer__tagline {
    font-size: var(--fs-xs);
    color: var(--secondary);
    opacity: 0.7;
    margin: 0;
  }
}
```

---

## Phase 3: Global Styles & Button System

**Goal**: Create a consistent button system and fix global styles

### 3.1 Update styles.css

**File**: `src/styles.css`

**Replace the button `.btn` styles and add new button variants. Find the existing `.btn` styles (around line 205-231) and replace with**:

```css
/* ==================== */
/* BUTTON SYSTEM        */
/* ==================== */

/* Base button - use this class for all buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  text-decoration: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 0.0625rem solid transparent;
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
}

.btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:focus-visible {
  outline: 0.125rem solid var(--primary);
  outline-offset: 0.125rem;
}

/* Button Variants */
.btn--secondary {
  background-color: transparent;
  border-color: light-dark(var(--border-light), var(--border-dark));
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.btn--secondary:hover:not(:disabled) {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-color: var(--primary);
}

.btn--outline {
  background-color: transparent;
  border-color: var(--primary);
  color: var(--primary);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
}

.btn--danger {
  background-color: var(--error);
  border-color: var(--error);
  color: light-dark(var(--surface-light), var(--surface-dark));
}

.btn--danger:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--primary);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.btn--ghost:hover:not(:disabled) {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}

/* Button Sizes */
.btn--sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--fs-xs);
}

.btn--lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--fs-md);
}

.btn--full {
  width: 100%;
}

/* Icon Button */
.btn--icon {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.btn--icon-only {
  padding: var(--spacing-sm);
  width: 2.25rem;
  height: 2.25rem;
}

/* Loading state */
.btn--loading {
  position: relative;
  color: transparent;
}

.btn--loading::after {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 0.125rem solid transparent;
  border-top-color: currentColor;
  border-radius: var(--radius-full);
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Spinner animation class */
.spinner {
  animation: btn-spin 1s linear infinite;
}
```

### 3.2 Add link styles to styles.css

**Add to `src/styles.css` after the button styles**:

```css
/* ==================== */
/* LINK STYLES          */
/* ==================== */

.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: var(--fw-medium);
  transition: color var(--transition-fast);
}

.link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.link--secondary {
  color: var(--secondary);
}

.link--secondary:hover {
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}
```

### 3.3 Fix form input styles in styles.css

**Replace the existing form input styles (around lines 186-203) with**:

```css
/* ==================== */
/* FORM STYLES          */
/* ==================== */

form .form-group {
  margin-bottom: var(--spacing-xl);
}

form .form-group:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: var(--spacing-sm);
  font-weight: var(--fw-medium);
  font-size: var(--fs-sm);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

form input[type="text"],
form input[type="email"],
form input[type="password"],
form input[type="number"],
form input[type="datetime-local"],
form textarea,
form select {
  padding: var(--spacing-md);
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-sm);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  font-size: var(--fs-md);
  font-family: inherit;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

form input:focus,
form textarea:focus,
form select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.1875rem light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05));
}

form input:disabled,
form textarea:disabled,
form select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

form input::placeholder,
form textarea::placeholder {
  color: var(--secondary);
}

/* Error states */
form input.input-error,
form textarea.input-error,
form select.input-error {
  border-color: var(--error);
}

form input.input-error:focus,
form textarea.input-error:focus,
form select.input-error:focus {
  box-shadow: 0 0 0 0.1875rem light-dark(var(--error-bg-light), var(--error-bg-dark));
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--fs-xs);
  color: var(--error);
}

.required {
  color: var(--error);
  font-weight: var(--fw-semibold);
}

/* Form hints */
.form-hint {
  font-size: var(--fs-xs);
  color: var(--secondary);
  margin-top: var(--spacing-xs);
}
```

---

## Phase 4: Dialog Content Polish

**Goal**: Style the UpdateModes and UpdateAlerts dialog content

### 4.1 Update UpdateModes.tsx

**File**: `src/components/reminder-form/UpdateModes.tsx`

**Replace entire file with**:

```tsx
import "./UpdateModes.css";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import ModeForm from "@/components/mode-form/ModeForm";
import { modesStore, reminderFormStore } from "@/store";
import { Trash2, Check, Mail, MessageSquare, Phone } from "lucide-react";

export default function UpdateModes({
  onDoneUpdatingModes,
}: {
  onDoneUpdatingModes: (newChecked: number[]) => void;
}) {
  const modes = useStore(modesStore);
  const reminderForm = useStore(reminderFormStore);
  const [checkedModes, setCheckedModes] = useState<Record<number, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const newCheckedModes: Record<number, boolean> = {};
    modes.forEach((mode) => {
      const isIncluded = reminderForm.reminders.includes(mode.id);
      if (isIncluded || checkedModes[mode.id]) {
        newCheckedModes[mode.id] = true;
      } else {
        newCheckedModes[mode.id] = false;
      }
    });
    setCheckedModes(newCheckedModes);
  }, [modes]);

  const toggleMode = (id: number) => {
    setCheckedModes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDone = () => {
    const selectedIds = Object.entries(checkedModes)
      .filter(([, checked]) => checked)
      .map(([id]) => parseInt(id));
    onDoneUpdatingModes(selectedIds);
  };

  const handleDelete = (id: number) => {
    const newModes = modes.filter((m) => m.id !== id);
    modesStore.setState(newModes);
    setCheckedModes((prev) => {
      const newChecked = { ...prev };
      delete newChecked[id];
      return newChecked;
    });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "email":
        return <Mail size={18} />;
      case "sms":
        return <MessageSquare size={18} />;
      case "call":
        return <Phone size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  const selectedCount = Object.values(checkedModes).filter(Boolean).length;

  return (
    <div className="UpdateModes">
      <div className="UpdateModes__header">
        <h2>Select Notification Modes</h2>
        <p className="UpdateModes__subtitle">
          {selectedCount} mode{selectedCount !== 1 ? "s" : ""} selected
        </p>
      </div>

      {modes.length > 0 ? (
        <div className="UpdateModes__list">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`UpdateModes__item ${checkedModes[mode.id] ? "UpdateModes__item--selected" : ""}`}
            >
              <button
                type="button"
                className="UpdateModes__item-main"
                onClick={() => toggleMode(mode.id)}
              >
                <div className="UpdateModes__item-check">
                  {checkedModes[mode.id] && <Check size={16} />}
                </div>
                <div className="UpdateModes__item-icon">
                  {getModeIcon(mode.mode)}
                </div>
                <div className="UpdateModes__item-info">
                  <span className="UpdateModes__item-type">{mode.mode}</span>
                  <span className="UpdateModes__item-address">{mode.address}</span>
                </div>
              </button>
              <button
                type="button"
                className="UpdateModes__item-delete"
                onClick={() => handleDelete(mode.id)}
                aria-label="Delete mode"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="UpdateModes__empty">
          <p>No notification modes configured yet.</p>
          <p className="UpdateModes__empty-hint">Add a mode below to get started.</p>
        </div>
      )}

      <div className="UpdateModes__add-section">
        {showAddForm ? (
          <div className="UpdateModes__add-form">
            <ModeForm onSuccess={() => setShowAddForm(false)} />
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Mode
          </button>
        )}
      </div>

      <div className="UpdateModes__footer">
        <button type="button" className="btn" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
```

### 4.2 Create UpdateModes.css

**File**: `src/components/reminder-form/UpdateModes.css`

**Create new file with**:

```css
.UpdateModes {
  padding: var(--spacing-xl);
  min-width: 20rem;
}

.UpdateModes__header {
  margin-bottom: var(--spacing-xl);
}

.UpdateModes__header h2 {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.UpdateModes__subtitle {
  font-size: var(--fs-sm);
  color: var(--secondary);
  margin: 0;
}

.UpdateModes__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.UpdateModes__item {
  display: flex;
  align-items: center;
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.UpdateModes__item--selected {
  border-color: var(--primary);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
}

.UpdateModes__item-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.UpdateModes__item-check {
  width: 1.25rem;
  height: 1.25rem;
  border: 0.125rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.UpdateModes__item--selected .UpdateModes__item-check {
  background-color: var(--primary);
  border-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
}

.UpdateModes__item-icon {
  color: var(--secondary);
  display: flex;
  align-items: center;
}

.UpdateModes__item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.UpdateModes__item-type {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  text-transform: capitalize;
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.UpdateModes__item-address {
  font-size: var(--fs-xs);
  color: var(--secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.UpdateModes__item-delete {
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.UpdateModes__item-delete:hover {
  color: var(--error);
}

.UpdateModes__empty {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
}

.UpdateModes__empty p {
  margin: 0;
  color: var(--secondary);
}

.UpdateModes__empty-hint {
  font-size: var(--fs-sm);
  margin-top: var(--spacing-xs);
}

.UpdateModes__add-section {
  margin-bottom: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

.UpdateModes__add-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.UpdateModes__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}
```

### 4.3 Update UpdateAlerts.tsx

**File**: `src/components/reminder-form/UpdateAlerts.tsx`

**Replace entire file with**:

```tsx
import "./UpdateAlerts.css";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import AlertForm from "@/components/alert-form/AlertForm";
import { alertsStore, reminderFormStore } from "@/store";
import { alertPresets } from "@/lib/validation";
import { Trash2, Check, Clock } from "lucide-react";

export default function UpdateAlerts({
  onDoneUpdatingAlerts,
}: {
  onDoneUpdatingAlerts: (newChecked: number[]) => void;
}) {
  const alerts = useStore(alertsStore);
  const reminderForm = useStore(reminderFormStore);
  const [checkedAlerts, setCheckedAlerts] = useState<Record<number, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const newCheckedAlerts: Record<number, boolean> = {};
    alerts.forEach((alert) => {
      const isIncluded = reminderForm.alerts.includes(alert.id);
      if (isIncluded || checkedAlerts[alert.id]) {
        newCheckedAlerts[alert.id] = true;
      } else {
        newCheckedAlerts[alert.id] = false;
      }
    });
    setCheckedAlerts(newCheckedAlerts);
  }, [alerts]);

  const toggleAlert = (id: number) => {
    setCheckedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDone = () => {
    const selectedIds = Object.entries(checkedAlerts)
      .filter(([, checked]) => checked)
      .map(([id]) => parseInt(id));
    onDoneUpdatingAlerts(selectedIds);
  };

  const handleDelete = (id: number) => {
    const newAlerts = alerts.filter((a) => a.id !== id);
    alertsStore.setState(newAlerts);
    setCheckedAlerts((prev) => {
      const newChecked = { ...prev };
      delete newChecked[id];
      return newChecked;
    });
  };

  const addPresetAlert = (preset: (typeof alertPresets)[0]) => {
    const exists = alerts.some((a) => a.ms === preset.ms && a.name === preset.name);
    if (!exists) {
      const newId = Math.max(...alerts.map((a) => a.id), 0) + 1;
      alertsStore.setState([...alerts, { id: newId, name: preset.name, ms: preset.ms }]);
      setCheckedAlerts((prev) => ({ ...prev, [newId]: true }));
    } else {
      const existingAlert = alerts.find((a) => a.ms === preset.ms && a.name === preset.name);
      if (existingAlert) {
        setCheckedAlerts((prev) => ({ ...prev, [existingAlert.id]: true }));
      }
    }
  };

  const selectedCount = Object.values(checkedAlerts).filter(Boolean).length;

  return (
    <div className="UpdateAlerts">
      <div className="UpdateAlerts__header">
        <h2>Select Alert Times</h2>
        <p className="UpdateAlerts__subtitle">
          {selectedCount} alert{selectedCount !== 1 ? "s" : ""} selected
        </p>
      </div>

      <div className="UpdateAlerts__presets">
        <h3 className="UpdateAlerts__presets-title">
          <Clock size={16} />
          Quick Add
        </h3>
        <div className="UpdateAlerts__preset-buttons">
          {alertPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="UpdateAlerts__preset-btn"
              onClick={() => addPresetAlert(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="UpdateAlerts__list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`UpdateAlerts__item ${checkedAlerts[alert.id] ? "UpdateAlerts__item--selected" : ""}`}
            >
              <button
                type="button"
                className="UpdateAlerts__item-main"
                onClick={() => toggleAlert(alert.id)}
              >
                <div className="UpdateAlerts__item-check">
                  {checkedAlerts[alert.id] && <Check size={16} />}
                </div>
                <span className="UpdateAlerts__item-name">{alert.name}</span>
              </button>
              <button
                type="button"
                className="UpdateAlerts__item-delete"
                onClick={() => handleDelete(alert.id)}
                aria-label="Delete alert"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="UpdateAlerts__empty">
          <p>No alerts configured yet.</p>
          <p className="UpdateAlerts__empty-hint">Use Quick Add above or add a custom alert below.</p>
        </div>
      )}

      <div className="UpdateAlerts__add-section">
        {showAddForm ? (
          <div className="UpdateAlerts__add-form">
            <AlertForm onSuccess={() => setShowAddForm(false)} />
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setShowAddForm(true)}
          >
            + Add Custom Alert
          </button>
        )}
      </div>

      <div className="UpdateAlerts__footer">
        <button type="button" className="btn" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
```

### 4.4 Update UpdateAlerts.css

**File**: `src/components/reminder-form/UpdateAlerts.css`

**Replace entire file with**:

```css
.UpdateAlerts {
  padding: var(--spacing-xl);
  min-width: 20rem;
}

.UpdateAlerts__header {
  margin-bottom: var(--spacing-xl);
}

.UpdateAlerts__header h2 {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.UpdateAlerts__subtitle {
  font-size: var(--fs-sm);
  color: var(--secondary);
  margin: 0;
}

.UpdateAlerts__presets {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-md);
}

.UpdateAlerts__presets-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  margin: 0 0 var(--spacing-md) 0;
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.UpdateAlerts__preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.UpdateAlerts__preset-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  cursor: pointer;
  transition: all var(--transition-fast);
}

.UpdateAlerts__preset-btn:hover {
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border-color: var(--primary);
}

.UpdateAlerts__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.UpdateAlerts__item {
  display: flex;
  align-items: center;
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.UpdateAlerts__item--selected {
  border-color: var(--primary);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
}

.UpdateAlerts__item-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.UpdateAlerts__item-check {
  width: 1.25rem;
  height: 1.25rem;
  border: 0.125rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.UpdateAlerts__item--selected .UpdateAlerts__item-check {
  background-color: var(--primary);
  border-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
}

.UpdateAlerts__item-name {
  font-size: var(--fs-sm);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.UpdateAlerts__item-delete {
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.UpdateAlerts__item-delete:hover {
  color: var(--error);
}

.UpdateAlerts__empty {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
}

.UpdateAlerts__empty p {
  margin: 0;
  color: var(--secondary);
}

.UpdateAlerts__empty-hint {
  font-size: var(--fs-sm);
  margin-top: var(--spacing-xs);
}

.UpdateAlerts__add-section {
  margin-bottom: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

.UpdateAlerts__add-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.UpdateAlerts__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}
```

---

## Phase 5: SwitchInput & Small Components Polish

**Goal**: Fix SwitchInput to use rem units and polish small components

### 5.1 Update Misc.css (SwitchInput)

**File**: `src/components/common/Misc.css`

**Replace entire file with**:

```css
/* ==================== */
/* SWITCH INPUT         */
/* ==================== */

.SwitchInput {
  width: 6.25rem;
  height: 1.5rem;
  position: relative;
}

.SwitchInput__checkbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  z-index: 2;
  cursor: pointer;
}

.SwitchInput__toggles {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  overflow: hidden;
  font-size: var(--fs-xs);
  z-index: 1;
}

.SwitchInput__toggle {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--fw-bold);
  letter-spacing: 0.0625rem;
  transition: background-color var(--transition-fast);
}

.SwitchInput__off {
  background-color: var(--primary);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border-top-left-radius: var(--radius-sm);
  border-bottom-left-radius: var(--radius-sm);
}

.SwitchInput__on {
  background-color: var(--secondary);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border-top-right-radius: var(--radius-sm);
  border-bottom-right-radius: var(--radius-sm);
}

.SwitchInput__checked .SwitchInput__off {
  background-color: var(--secondary);
}

.SwitchInput__checked .SwitchInput__on {
  background-color: var(--primary);
}

/* ==================== */
/* TILE COMPONENT       */
/* ==================== */

.Tile {
  position: relative;
  border: 0.0625rem solid var(--secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-sm);
}

.Tile__checkbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 5.2 Update ReminderForm.css

**File**: `src/components/reminder-form/ReminderForm.css`

**Replace entire file with**:

```css
.ReminderForm {
  max-width: 40rem;
  margin: 0 auto;
}

.ReminderForm__form {
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.ReminderForm h3 {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  margin: 0 0 var(--spacing-sm) 0;
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.ReminderForm p {
  margin: var(--spacing-sm) 0 0 0;
  font-size: var(--fs-sm);
  color: var(--secondary);
}

.ReminderForm .info-text {
  font-size: var(--fs-sm);
  color: var(--secondary);
  font-style: italic;
}

.ReminderForm .required {
  color: var(--error);
  font-weight: var(--fw-semibold);
}

.ReminderForm .error-message {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--fs-xs);
  color: var(--error);
}

.ReminderForm .input-error {
  border-color: var(--error);
}

.ReminderForm .input-error:focus {
  box-shadow: 0 0 0 0.1875rem light-dark(var(--error-bg-light), var(--error-bg-dark));
}

.ReminderForm .spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Modes and Alerts lists */
.ReminderForm ul {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ReminderForm ul li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
}

.ReminderForm ul li button {
  padding: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ReminderForm ul li button:hover {
  color: var(--error);
  background-color: light-dark(var(--error-bg-light), var(--error-bg-dark));
}

@media (max-width: 40rem) {
  .ReminderForm__form {
    padding: var(--spacing-lg);
  }
}
```

---

## Phase 6: Page-Level Polish

**Goal**: Polish specific pages for better desktop and mobile experience

### 6.1 Update Home.css

**File**: `src/components/home/Home.css`

**Replace entire file with**:

```css
.HomePage {
  width: 100%;
}

.HomePage__container {
  max-width: 75rem;
  margin: 0 auto;
}

.HomePage__header {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  margin-bottom: var(--spacing-2xl);
}

/* Desktop grid layout */
@media (min-width: 64rem) {
  .HomePage__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: var(--spacing-xl);
  }

  .HomePage__container > :first-child {
    grid-column: 1 / -1;
  }
}
```

### 6.2 Update QuickStats.css

**File**: `src/components/home/QuickStats.css`

**Replace entire file with**:

```css
.QuickStats {
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
}

.QuickStats__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  margin: 0 0 var(--spacing-lg) 0;
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.QuickStats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--spacing-lg);
}

.QuickStats__stat {
  text-align: center;
  padding: var(--spacing-md);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-sm);
}

.QuickStats__stat-value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--primary);
  display: block;
}

.QuickStats__stat-label {
  font-size: var(--fs-xs);
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 0.0625rem;
}

.QuickStats__loading {
  text-align: center;
  color: var(--secondary);
  padding: var(--spacing-xl);
}
```

### 6.3 Update RemindersList.css

**File**: `src/components/reminders-list/RemindersList.css`

**Replace entire file with**:

```css
.RemindersList {
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
}

.RemindersList__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.RemindersList__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  margin: 0;
}

.RemindersList__grid {
  display: grid;
  gap: var(--spacing-lg);
}

.RemindersList__loading,
.RemindersList__error,
.RemindersList__empty,
.RemindersList__no-results {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border-radius: var(--radius-md);
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

.RemindersList__loading {
  font-size: var(--fs-lg);
  color: var(--secondary);
}

.RemindersList__error {
  border-color: var(--error);
}

.RemindersList__error p:first-child {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--error);
  margin: 0 0 var(--spacing-md) 0;
}

.RemindersList__error-message {
  font-size: var(--fs-sm);
  color: var(--secondary);
  margin: 0;
}

.RemindersList__empty p:first-child,
.RemindersList__no-results p:first-child {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  margin: 0 0 var(--spacing-md) 0;
}

.RemindersList__empty-hint,
.RemindersList__no-results-hint {
  font-size: var(--fs-md);
  color: var(--secondary);
  margin: 0;
}

/* Responsive grid */
@media (min-width: 48rem) {
  .RemindersList__grid {
    grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  }
}

@media (min-width: 80rem) {
  .RemindersList__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 6.4 Update ReminderCard.css

**File**: `src/components/reminders-list/ReminderCard.css`

**Replace entire file with**:

```css
.ReminderCard {
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.ReminderCard:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-0.125rem);
}

.ReminderCard--past {
  opacity: 0.7;
}

.ReminderCard--inactive {
  border-color: var(--secondary);
  opacity: 0.6;
}

.ReminderCard--upcoming {
  border-left: 0.25rem solid var(--primary);
}

.ReminderCard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.ReminderCard__title-section {
  flex: 1;
  min-width: 0;
}

.ReminderCard__title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  word-wrap: break-word;
}

.ReminderCard__badges {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.ReminderCard__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
}

.ReminderCard__badge--recurring {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  color: var(--primary);
}

.ReminderCard__badge--inactive,
.ReminderCard__badge--past {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  color: var(--secondary);
}

.ReminderCard__actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.ReminderCard__action-btn {
  background: none;
  border: none;
  font-size: var(--fs-md);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.ReminderCard__action-btn:hover {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}

.ReminderCard__action-btn--delete:hover {
  background-color: light-dark(var(--error-bg-light), var(--error-bg-dark));
}

.ReminderCard__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.ReminderCard__date,
.ReminderCard__location {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--fs-sm);
  flex-wrap: wrap;
}

.ReminderCard__label {
  font-weight: var(--fw-medium);
  color: var(--secondary);
}

.ReminderCard__modes,
.ReminderCard__alerts {
  margin-bottom: var(--spacing-sm);
}

.ReminderCard__modes-list,
.ReminderCard__alerts-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.ReminderCard__mode,
.ReminderCard__alert {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
}

.ReminderCard__alert-more {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--fs-xs);
  color: var(--secondary);
  font-style: italic;
}

.ReminderCard__description-section {
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
}

.ReminderCard__expand-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  padding: 0;
  transition: color var(--transition-fast);
}

.ReminderCard__expand-btn:hover {
  color: var(--primary-hover);
}

.ReminderCard__description {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Delete confirmation overlay */
.ReminderCard__delete-confirm {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  border: 0.125rem solid var(--error);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  min-width: min(20rem, 90vw);
}

.ReminderCard__delete-confirm::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--backdrop-opacity);
  backdrop-filter: var(--backdrop-blur);
  z-index: -1;
}

.ReminderCard__delete-confirm p {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--fs-md);
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.ReminderCard__delete-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.ReminderCard__confirm-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ReminderCard__confirm-btn:not(.ReminderCard__confirm-btn--danger) {
  border: 0.0625rem solid light-dark(var(--border-light), var(--border-dark));
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  color: light-dark(var(--foreground-light), var(--foreground-dark));
}

.ReminderCard__confirm-btn:not(.ReminderCard__confirm-btn--danger):hover {
  background-color: light-dark(var(--surface-alt-light), var(--surface-alt-dark));
}

.ReminderCard__confirm-btn--danger {
  background-color: var(--error);
  color: light-dark(var(--surface-light), var(--surface-dark));
  border: none;
}

.ReminderCard__confirm-btn--danger:hover {
  filter: brightness(1.1);
}

@media (max-width: 30rem) {
  .ReminderCard__header {
    flex-direction: column;
  }

  .ReminderCard__actions {
    align-self: flex-end;
  }
}
```

---

## Phase 7: Final Cleanup & Edge Cases

**Goal**: Fix remaining issues and ensure consistency

### 7.1 Hide React Query DevTools in production

**File**: `src/routes/__root.tsx`

**Find the ReactQueryDevtools import and component, and update to hide in production**:

```tsx
// At the top of the file, import should already exist
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// In the component, update the ReactQueryDevtools to only show in development
{process.env.NODE_ENV === "development" && (
  <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
)}
```

### 7.2 Ensure body doesn't have centering that causes issues

**File**: `src/styles.css`

**Update the body styles (around line 78-88) to**:

```css
body {
  font-family: var(--font-primary);
  background-color: light-dark(var(--background-light), var(--background-dark));
  color: light-dark(var(--foreground-light), var(--foreground-dark));
  transition: background-color var(--transition-slow);
  margin: 0;
  min-width: 20rem;
  min-height: 100vh;
}
```

**Note**: Remove `display: flex` and `place-items: center` as they can cause centering issues with the layout.

### 7.3 Add mobile bottom padding to main content

**File**: `src/components/layout/Layout.css`

**Ensure there's padding at the bottom on mobile to account for the fixed mobile nav**:

```css
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.Layout main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  padding-bottom: 6rem; /* Space for mobile nav */
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 48rem) {
  .Layout main {
    padding: var(--spacing-xl);
    padding-bottom: var(--spacing-xl); /* Reset on desktop */
  }
}

@media (min-width: 64rem) {
  .Layout main {
    padding: var(--spacing-2xl);
    padding-bottom: var(--spacing-2xl);
  }
}
```

---

## Implementation Checklist

Use this checklist to track progress:

### Phase 1: Critical Layout Fixes
- [ ] Update `src/components/layout/Layout.css`
- [ ] Update `src/components/common/Dialog.css`
- [ ] Update `src/components/layout/mobile-nav/MobileNav.css`
- [ ] Update `src/components/layout/mobile-nav/MobileNav.tsx`

### Phase 2: Desktop View Polish
- [ ] Update `src/components/layout/navbar/Navbar.tsx`
- [ ] Update `src/components/layout/navbar/Navbar.css`
- [ ] Update `src/components/layout/navbar/NavLinks.tsx`
- [ ] Create `src/components/layout/navbar/NavLinks.css`
- [ ] Update `src/components/layout/footer/Footer.tsx`
- [ ] Update `src/components/layout/footer/Footer.css`

### Phase 3: Global Styles & Button System
- [ ] Update button styles in `src/styles.css`
- [ ] Add link styles to `src/styles.css`
- [ ] Update form styles in `src/styles.css`

### Phase 4: Dialog Content Polish
- [ ] Update `src/components/reminder-form/UpdateModes.tsx`
- [ ] Create `src/components/reminder-form/UpdateModes.css`
- [ ] Update `src/components/reminder-form/UpdateAlerts.tsx`
- [ ] Update `src/components/reminder-form/UpdateAlerts.css`

### Phase 5: SwitchInput & Small Components
- [ ] Update `src/components/common/Misc.css`
- [ ] Update `src/components/reminder-form/ReminderForm.css`

### Phase 6: Page-Level Polish
- [ ] Update `src/components/home/Home.css`
- [ ] Update `src/components/home/QuickStats.css`
- [ ] Update `src/components/reminders-list/RemindersList.css`
- [ ] Update `src/components/reminders-list/ReminderCard.css`

### Phase 7: Final Cleanup
- [ ] Update `src/routes/__root.tsx` (hide React Query DevTools in production)
- [ ] Update body styles in `src/styles.css`
- [ ] Verify all changes work together

---

## Testing Instructions

After implementing each phase, verify:

1. **No horizontal scroll** - Check on all viewport sizes
2. **Dialog appears above mobile menu** - Open dialog on mobile
3. **Desktop navbar looks complete** - Has logo, name, links, user info
4. **Footer is professional** - Not placeholder text
5. **Buttons are consistent** - All use the button system
6. **Forms look unified** - All inputs have same border style
7. **Mobile menu works** - Backdrop appears, z-index is correct
8. **Dark mode works** - All components respect theme

---

*Generated: February 2026*
