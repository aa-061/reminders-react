# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reminders Client is a React application for managing reminders with configurable notification modes (email, SMS, etc.) and alerts (time-based reminders before the actual reminder date). The app uses TanStack Router for file-based routing and TanStack Query for server state management.

## Commands

### Development
- `npm run dev` - Start Vite dev server on port 3000
- `npm run build` - Build for production and run TypeScript type checking
- `npm test` - Run Vitest test suite once
- `npm run sort-imports` - Format and sort imports using Prettier

### Environment Setup
- Copy `.env` file for configuration
- Must set `VITE_SERVER_URL` environment variable to the backend server URL (checked at auth-client initialization)

## Architecture

### Technology Stack
- **Routing**: TanStack Router with file-based routing (auto code-splitting enabled)
- **State Management**: TanStack Store (reactive observable store) for UI state
- **Server State**: TanStack React Query for server data and caching
- **Authentication**: better-auth library with cookie-based credentials
- **Build Tool**: Vite with React plugin

### Core State Management (src/store.ts)
The app uses multiple TanStack Store instances for local state:
- `modeStore` / `modesStore` - Notification modes (email, SMS, etc.) with addresses
- `reminderFormStore` - Form state for creating reminders (title, date, reminders, alerts, recurring, description)
- `alertStore` / `alertsStore` - Alert configurations (pre-reminder time notifications)
- `showAddNewModeFormStore` - Toggle for showing mode creation form
- `dialogStore` - Global dialog state (isOpen, onClose, children)

All stores are synchronously reactive—components using `useStore()` hook re-render on state changes.

### Authentication
- Uses `better-auth` client in `src/lib/auth-client.ts`
- Credentials (cookies) included in all requests via `credentials: 'include'` in fetch options
- Exports: `signIn`, `signUp`, `signOut`, `useSession`
- Server URL must be provided via `VITE_SERVER_URL` env var

### Routing Structure (src/routes/)
- `__root.tsx` - Root layout wrapping all routes with Layout component
- `index.tsx` - Home page
- `login/index.tsx` - Login page
- `reminders/index.tsx` - Reminders list page
- `reminders/new/index.tsx` - Create new reminder page

Routes are auto-generated via TanStack Router plugin; route tree is generated to `src/routeTree.gen.ts`.

### Components Organization
- **layout/** - Layout wrapper (Navbar, Footer, MobileNav)
- **reminders-list/** - Display list of reminders
- **new-reminder/** - Container for creating reminders
- **reminder-form/** - Core reminder creation form with subcomponents:
  - `ReminderForm.tsx` - Main form
  - `UpdateModes.tsx` - Mode selection/management
  - `UpdateAlerts.tsx` - Alert time configuration
  - `AvailableModes.tsx` - Display available modes
- **mode-form/** - Form for creating new notification modes
- **alert-form/** - Form for creating new alert definitions
- **common/** - Reusable components (Dialog, Tile, Misc utilities)

### Type System (src/types.ts)
Core types:
- `IMode` - Notification mode with id, mode name, and address
- `IReminderMode` - Simplified mode for reminders (mode + address only)
- `ICreateReminder` - Form-bound reminder creation payload
- `IAugmentedReminder` - Fully populated reminder with nested mode/alert objects
- `IAlert` - Alert configuration (id, name, milliseconds)
- `IDialog` - Dialog state interface

## CSS Guidelines (CRITICAL)

### Color Management
- **NEVER hardcode colors in CSS files**. All colors MUST be defined as CSS custom properties in `src/styles.css` under `:root {}`
- **Use hex colors** (e.g., `#161fd2`) instead of rgba or other formats
- **Minimize color palette**: Only use `--primary`, `--secondary`, and a few essential error/validation colors
- For hover states, use `--primary-hover` or subtle variations, but avoid creating unnecessary colors
- All colors must use the `light-dark()` function for automatic dark mode support

### CSS Variables
- **Leverage CSS custom properties** for everything:
  - Spacing: Use `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`, `--spacing-2xl`
  - Border radius: Use `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
  - Shadows: Use `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-button`
  - Transitions: Use `--transition-fast`, `--transition-base`, `--transition-slow`
  - Typography: Use `--fs-xs`, `--fs-sm`, `--fs-md`, etc. and `--fw-normal`, `--fw-medium`, `--fw-semibold`, `--fw-bold`

### Units
- **Use rem instead of px** wherever possible for better accessibility and responsiveness
- Convert pixels to rem by dividing by 16 (e.g., `16px` → `1rem`, `8px` → `0.5rem`)

### Class Naming Convention
- **Component CSS classes**: Prefix with PascalCase component name followed by `__`
  - Example: For `Login` component, use `.Login__container`, `.Login__form`, `.Login__button`
- **Route/Page CSS classes**: Prefix with PascalCase page name followed by `Page__`
  - Example: For login route, use `.LoginPage__container`, `.LoginPage__card`, `.LoginPage__form`
- This prevents CSS class name collisions and makes it easy to identify which component styles belong to

### Example
```css
/* ❌ BAD - Hardcoded colors, px units, generic class names */
.container {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ✅ GOOD - Variables, rem units, proper naming */
.LoginPage__container {
  background-color: light-dark(var(--surface-light), var(--surface-dark));
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

## Validation Guidelines

### Use Zod for Form Validation
- **NEVER use custom regex** for validation - use Zod schemas instead
- Zod provides better error messages, type safety, and maintainability
- If you need specialized validation, consider installing a popular validation library from npm

### Example
```typescript
// ❌ BAD - Custom regex
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ GOOD - Zod validation
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const result = loginSchema.safeParse({ email, password });
```

## Development Notes

### Dialog System
Global dialog management via `dialogStore`. Components can set dialog state to display alerts, confirmations, or forms modally. Dialog component renders from store state in root provider.

### Form State Management
Reminders form uses `reminderFormStore` which contains arrays of:
- `reminders` - Selected mode IDs
- `alerts` - Selected alert IDs

Component subcomponents (`UpdateModes`, `UpdateAlerts`) manage adding/removing these IDs while the parent handles the overall form submission.

### Dev Tools
- TanStack Router DevTools available (can be removed from root route)
- TanStack React Query DevTools included with `initialIsOpen={false}`
- TanStack Devtools Vite plugin enabled for development

### Build Configuration
- Path alias `@` maps to `./src` for cleaner imports
- TypeScript strict mode enabled with unused variable checking
- No emit mode for type checking only (Vite handles bundling)
- Auto code-splitting enabled on TanStack Router for route-based chunks
