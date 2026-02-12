# Reminders Client - Implementation Roadmap

This document outlines the complete implementation plan for the Reminders client application. Each phase is designed to be independently executable and can be assigned to different agents or completed manually.

---

## Current State Assessment

### What's Implemented
- TanStack Router with file-based routing (5 routes)
- Basic authentication (login page with Better Auth)
- TanStack Store for local state management
- TanStack React Query setup
- Basic reminder form with modes/alerts selection
- Layout structure (Navbar, Footer, MobileNav)
- CSS foundation with variables, light/dark mode support

### What Needs Work
- 401 authentication bug in production (cross-origin cookies)
- Reminders list page (basic structure only)
- Route protection (authenticated routes)
- Edit reminder functionality
- Form validation and error handling
- Loading states and feedback
- Complete CSS styling
- UX polish and improvements

---

## Phase 0: Fix Authentication Bug (Critical)

**Priority**: CRITICAL - Must be completed first

### Problem Analysis
The 401 error occurs because `.onrender.com` is a **public suffix domain**. Cookies cannot be shared between different subdomains (e.g., `client.onrender.com` and `server.onrender.com`). This is a browser security feature.

### Solution Options

#### Option A: Custom Domain (Recommended)
1. Register a custom domain (e.g., `myreminders.com`)
2. Configure DNS:
   - `app.myreminders.com` → Client (Render)
   - `api.myreminders.com` → Server (Render)
3. Update environment variables:
   - Server: `CORS_ORIGIN=https://app.myreminders.com`, `BASE_URL=https://api.myreminders.com`
   - Client: `VITE_SERVER_URL=https://api.myreminders.com`
4. Configure Better Auth for cross-subdomain cookies:
   ```typescript
   // server/src/auth/index.ts
   export const auth = betterAuth({
     // ... existing config
     advanced: {
       crossSubDomainCookies: {
         enabled: true,
         domain: '.myreminders.com', // leading dot required
       },
       defaultCookieAttributes: {
         sameSite: 'lax',
         secure: true,
         httpOnly: true,
       },
     },
   });
   ```

#### Option B: Same-Origin Deployment (Alternative)
Deploy client and server on the same origin using a reverse proxy or path-based routing:
- `myapp.onrender.com/` → Client
- `myapp.onrender.com/api/` → Server (proxied)

#### Option C: Cross-Origin Cookie Configuration (Temporary)
Configure Better Auth for cross-origin cookies (less recommended due to third-party cookie restrictions):
```typescript
// server/src/auth/index.ts
export const auth = betterAuth({
  // ... existing config
  advanced: {
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: 'none',
          secure: true,
          partitioned: true, // Required for modern browsers
        },
      },
    },
  },
});
```

### Tasks
- [ ] Choose solution approach (A, B, or C)
- [ ] If Option A: Register and configure custom domain
- [ ] Update server Better Auth configuration
- [ ] Update environment variables on Render (both client and server)
- [ ] Test authentication flow end-to-end
- [ ] Verify reminders API returns data after login

### References
- [Better Auth Cookies Documentation](https://www.better-auth.com/docs/concepts/cookies)
- [Better Auth Security Reference](https://www.better-auth.com/docs/reference/security)
- [GitHub Issue: Cross-Domain cookies on render.com](https://github.com/better-auth/better-auth/issues/4038)

---

## Phase 1: Route Protection & Auth Flow

**Goal**: Implement proper authentication guards and user feedback

### 1.1 Create Auth Guard Component
Create a reusable auth guard that protects routes requiring authentication.

**File**: `src/components/auth/AuthGuard.tsx`

```typescript
// Wraps protected routes, redirects to /login if not authenticated
// Shows loading state while checking session
// Preserves intended destination for redirect after login
```

### 1.2 Implement Protected Route Wrapper
Use TanStack Router's `beforeLoad` hook for route-level protection.

**Tasks**:
- [ ] Create `AuthGuard` component using `useSession` hook
- [ ] Add `beforeLoad` guard to protected routes (`/reminders/*`)
- [ ] Implement redirect to intended page after successful login
- [ ] Add session check on app mount in root route
- [ ] Create logout functionality with redirect

### 1.3 Improve Login Page
- [ ] Add form validation (email format, required fields)
- [ ] Show loading state during sign-in
- [ ] Display error messages for failed attempts
- [ ] Add "Remember me" option
- [ ] Redirect to home after successful login
- [ ] Style login form consistently with app design

### 1.4 Create Registration Page (Optional - if ALLOW_REGISTRATION=true)
**File**: `src/routes/register/index.tsx`
- [ ] Registration form (name, email, password, confirm password)
- [ ] Form validation
- [ ] Error handling
- [ ] Redirect to login on success

---

## Phase 2: Home Page Implementation

**Goal**: Create an engaging home page that serves as the dashboard

### 2.1 Design Home Page Layout
The home page should provide:
- Quick overview of upcoming reminders (next 24-48 hours)
- Quick-add reminder functionality
- Navigation to full reminders list
- Stats/summary (total active, upcoming today, etc.)

### 2.2 Components to Create

#### QuickStats Component
**File**: `src/components/home/QuickStats.tsx`
- Total active reminders
- Reminders due today
- Reminders due this week
- Visual indicators (icons, colors)

#### UpcomingReminders Component
**File**: `src/components/home/UpcomingReminders.tsx`
- List of next 5 upcoming reminders
- Show title, date/time, countdown
- Quick actions (mark done, snooze, edit)
- "View all" link to full list

#### QuickAddReminder Component
**File**: `src/components/home/QuickAddReminder.tsx`
- Simplified inline form
- Just title and date/time
- Uses default modes and alerts
- Expandable to full form

### 2.3 Tasks
- [ ] Design home page wireframe/layout
- [ ] Create `QuickStats` component
- [ ] Create `UpcomingReminders` component
- [ ] Create `QuickAddReminder` component
- [ ] Update `Home.tsx` to compose these components
- [ ] Style with CSS (follow existing patterns)
- [ ] Add loading states
- [ ] Handle empty states (no reminders)

---

## Phase 3: Reminders List Page

**Goal**: Complete, functional list of all reminders with filtering and actions

### 3.1 Features Required
- Display all reminders in a clear, scannable format
- Filter by status (active, completed, all)
- Sort by date, title, created
- Search reminders
- Bulk actions (delete, mark complete)
- Individual actions (edit, delete, toggle active)

### 3.2 Components to Create/Update

#### ReminderCard Component
**File**: `src/components/reminders-list/ReminderCard.tsx`
- Title, date/time display
- Status indicator (active, past, recurring)
- Notification modes icons
- Alert count badge
- Action buttons (edit, delete, toggle)
- Expandable details (description, full alert list)

#### RemindersFilter Component
**File**: `src/components/reminders-list/RemindersFilter.tsx`
- Status filter dropdown (all, active, inactive)
- Sort dropdown (date, title, created)
- Search input
- Clear filters button

#### RemindersTable Component (Alternative View)
**File**: `src/components/reminders-list/RemindersTable.tsx`
- Table view option for desktop
- Sortable columns
- Checkbox selection for bulk actions

### 3.3 Tasks
- [ ] Create `ReminderCard` component
- [ ] Create `RemindersFilter` component
- [ ] Update `RemindersList.tsx` with proper data display
- [ ] Implement delete reminder (with confirmation dialog)
- [ ] Implement toggle active/inactive
- [ ] Add filter functionality (client-side)
- [ ] Add search functionality
- [ ] Add pagination or infinite scroll (if needed)
- [ ] Style all components
- [ ] Handle loading and error states
- [ ] Handle empty state (no reminders found)

### 3.4 API Integration
```typescript
// Queries needed:
// GET /reminders - active reminders
// GET /reminders/all - all reminders
// DELETE /reminders/:id - delete single
// DELETE /reminders/bulk?ids=1-5 - bulk delete
// PUT /reminders/:id - update (toggle active)
```

---

## Phase 4: Create/Edit Reminder Page

**Goal**: Full-featured reminder creation and editing with validation

### 4.1 Enhance Existing ReminderForm
The form exists but needs improvements:
- Form validation
- Edit mode (populate from existing reminder)
- Better date/time handling
- Recurring reminder configuration
- Location field
- Better UX for modes and alerts

### 4.2 Create Edit Route
**File**: `src/routes/reminders/$id/edit/index.tsx`
- Load existing reminder by ID
- Pre-populate form
- Submit updates via PUT /reminders/:id

### 4.3 Form Enhancements

#### Validation Rules
- Title: Required, max 200 characters
- Date: Required, must be in future (for new reminders)
- At least one notification mode required
- At least one alert required
- Description: Optional, max 2000 characters

#### Recurring Reminder Configuration
**File**: `src/components/reminder-form/RecurrenceConfig.tsx`
- Enable/disable recurring
- Frequency options (daily, weekly, monthly, custom)
- Custom cron expression input (advanced)
- Start date / End date pickers
- Preview next occurrences

#### Improved Mode Selection
- Visual mode selector with icons
- Quick add common modes (personal email, work email)
- Inline mode creation
- Mode management (edit, delete from global list)

#### Improved Alert Selection
- Visual alert selector
- Common presets (5 min, 15 min, 1 hour, 1 day)
- Custom alert time input
- Multiple alert selection with easy removal

### 4.4 Tasks
- [ ] Add form validation with error messages
- [ ] Create edit route with URL parameter
- [ ] Create `useReminder(id)` hook for fetching single reminder
- [ ] Implement edit form pre-population
- [ ] Create `RecurrenceConfig` component
- [ ] Improve mode selection UX
- [ ] Improve alert selection UX
- [ ] Add location field (optional)
- [ ] Add form submission loading state
- [ ] Add success feedback (toast/notification)
- [ ] Navigate to list after successful create/edit
- [ ] Handle API errors gracefully

---

## Phase 5: Notification Modes Management

**Goal**: Allow users to manage their notification channels

### 5.1 Create Modes Settings Page
**File**: `src/routes/settings/modes/index.tsx`

Features:
- List all configured modes
- Add new mode (email, SMS, etc.)
- Edit existing mode
- Delete mode
- Set default modes for new reminders

### 5.2 Components

#### ModesList Component
**File**: `src/components/modes/ModesList.tsx`
- Display all modes in cards/list
- Edit/delete actions
- Icon per mode type

#### ModeFormDialog Component
**File**: `src/components/modes/ModeFormDialog.tsx`
- Native `<dialog>` element
- Add/edit mode form
- Mode type selector
- Address input (email, phone number, etc.)
- Validation

### 5.3 Tasks
- [ ] Create modes settings route
- [ ] Create `ModesList` component
- [ ] Create `ModeFormDialog` component
- [ ] Persist modes (consider localStorage or server-side)
- [ ] Add validation for email/phone formats
- [ ] Style components

---

## Phase 6: Alerts Configuration

**Goal**: Allow users to customize alert timing options

### 6.1 Create Alerts Settings Page
**File**: `src/routes/settings/alerts/index.tsx`

Features:
- List all alert presets
- Add custom alert times
- Edit/delete alerts
- Set default alerts for new reminders

### 6.2 Components

#### AlertsList Component
**File**: `src/components/alerts/AlertsList.tsx`
- Display all alert presets
- Human-readable time formatting
- Edit/delete actions

#### AlertFormDialog Component
**File**: `src/components/alerts/AlertFormDialog.tsx`
- Native `<dialog>` element
- Time input (minutes/hours/days before)
- Name for the alert preset
- Validation (minimum 3 seconds)

### 6.3 Tasks
- [ ] Create alerts settings route
- [ ] Create `AlertsList` component
- [ ] Create `AlertFormDialog` component
- [ ] Persist alerts (localStorage or server-side)
- [ ] Add time conversion utilities
- [ ] Style components

---

## Phase 7: Global Dialog System

**Goal**: Implement a robust dialog system using native HTML dialog

### 7.1 Enhance Dialog Component
**File**: `src/components/common/Dialog.tsx`

Features:
- Use native `<dialog>` element
- Support for modal and non-modal modes
- Proper focus management
- Backdrop click to close (optional)
- Escape key to close
- Animation support (CSS)
- Accessible (ARIA attributes)

### 7.2 Dialog Variants

#### ConfirmDialog
For delete confirmations, destructive actions
```typescript
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}
```

#### AlertDialog
For notifications, success messages
```typescript
interface AlertDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}
```

#### FormDialog
For inline forms (modes, alerts, quick add)

### 7.3 Tasks
- [ ] Refactor existing Dialog to use native `<dialog>`
- [ ] Create `ConfirmDialog` variant
- [ ] Create `AlertDialog` variant
- [ ] Add CSS animations (open/close)
- [ ] Ensure accessibility
- [ ] Update all components using dialogs

---

## Phase 8: Responsive Design & CSS Polish

**Goal**: Ensure the app looks great on all devices

### 8.1 Design Principles
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Use existing CSS variables
- Keep it simple, not flashy

### 8.2 Layout Updates

#### Mobile (< 640px)
- Single column layout
- Bottom navigation (MobileNav)
- Full-width cards
- Larger touch targets
- Simplified forms

#### Tablet (640px - 1024px)
- Two-column layout where appropriate
- Side navigation option
- Card grid (2 columns)

#### Desktop (> 1024px)
- Three-column layout for dashboard
- Sidebar navigation
- Card grid (3-4 columns)
- Table view for reminders list

### 8.3 Component-Specific Styles

#### Navbar
- [ ] Responsive logo/title
- [ ] Hamburger menu for mobile
- [ ] User menu dropdown

#### Cards
- [ ] Consistent card styling
- [ ] Hover states
- [ ] Active/selected states

#### Forms
- [ ] Consistent input styling
- [ ] Error state styling
- [ ] Focus states
- [ ] Disabled states

#### Buttons
- [ ] Primary, secondary, danger variants
- [ ] Icon buttons
- [ ] Loading state with spinner
- [ ] Disabled state

### 8.4 Tasks
- [ ] Audit all components for responsive issues
- [ ] Update Navbar for mobile
- [ ] Update Layout for responsive grid
- [ ] Style ReminderCard for all breakpoints
- [ ] Style forms consistently
- [ ] Create button variants
- [ ] Add loading spinners/skeletons
- [ ] Test on actual mobile devices

---

## Phase 9: UX Enhancements

**Goal**: Polish the user experience with modern UX patterns

### 9.1 Features from Research

Based on analysis of top reminder apps in 2025-2026:

#### Smart Scheduling
- [ ] Timezone display/conversion
- [ ] Natural language date input (optional enhancement)
- [ ] Suggested times based on patterns

#### Ease of Use (3 taps or less)
- [ ] Quick add from home
- [ ] Swipe actions on mobile
- [ ] Keyboard shortcuts on desktop

#### Customization
- [ ] Snooze functionality
- [ ] Reschedule quick action
- [ ] Custom repeat patterns

### 9.2 Toast Notifications
**File**: `src/components/common/Toast.tsx`
- Success/error/info variants
- Auto-dismiss
- Manual dismiss
- Stack multiple toasts

### 9.3 Loading States
- Skeleton loaders for lists
- Spinner for buttons
- Full-page loader for route transitions

### 9.4 Empty States
- Friendly illustrations (optional)
- Clear call-to-action
- Different states for:
  - No reminders yet
  - No search results
  - Error loading

### 9.5 Keyboard Navigation
- Tab navigation
- Enter to submit forms
- Escape to close dialogs
- Arrow keys for lists

### 9.6 Tasks
- [ ] Create Toast component and system
- [ ] Add skeleton loaders
- [ ] Design empty states
- [ ] Implement keyboard shortcuts
- [ ] Add snooze functionality
- [ ] Add reschedule quick action

---

## Phase 10: Testing & Quality Assurance

**Goal**: Ensure reliability through testing

### 10.1 Unit Tests
- Component rendering tests
- Store logic tests
- Utility function tests

### 10.2 Integration Tests
- Form submission flows
- Authentication flows
- API integration tests

### 10.3 E2E Tests (Optional)
- Full user journeys
- Cross-browser testing

### 10.4 Tasks
- [ ] Set up Vitest configuration
- [ ] Write tests for utility functions
- [ ] Write tests for store logic
- [ ] Write component tests
- [ ] Write integration tests for key flows
- [ ] Set up test coverage reporting

---

## Phase 11: Performance Optimization

**Goal**: Ensure fast, responsive application

### 11.1 Code Splitting
- TanStack Router already handles route-based splitting
- Consider component-level splitting for large components

### 11.2 Query Optimization
- Appropriate stale times
- Background refetching
- Prefetching on hover

### 11.3 Bundle Analysis
- Analyze bundle size
- Remove unused dependencies
- Optimize imports

### 11.4 Tasks
- [ ] Run bundle analysis
- [ ] Optimize React Query settings
- [ ] Add prefetching for likely navigations
- [ ] Lazy load heavy components
- [ ] Optimize images (if any)

---

## Phase 12: Final Polish & Documentation

**Goal**: Production-ready application

### 12.1 Error Handling
- Global error boundary
- Graceful API error handling
- Offline detection and message

### 12.2 Accessibility Audit
- Screen reader testing
- Color contrast check
- Keyboard navigation verification
- ARIA labels

### 12.3 Documentation
- Update CLAUDE.md with final architecture
- Document component props
- API integration documentation

### 12.4 Tasks
- [ ] Add ErrorBoundary component
- [ ] Improve API error messages
- [ ] Run accessibility audit
- [ ] Fix accessibility issues
- [ ] Update documentation
- [ ] Final cross-browser testing

---

## Future Enhancements (Post-MVP)

These features can be considered after the core application is complete:

### Calendar View
- Monthly/weekly calendar display
- Drag-and-drop rescheduling
- Integration with external calendars (Google, iCal)

### Categories/Tags
- Organize reminders by category
- Color-coded tags
- Filter by tag

### Collaborative Features
- Share reminders with others
- Family/team reminder lists
- Assignment functionality

### Notification Improvements
- Push notifications (Service Worker)
- SMS integration
- WhatsApp/Telegram bots

### Analytics Dashboard
- Completion rate tracking
- Most common reminder types
- Activity patterns

### AI Features
- Smart suggestions
- Natural language input
- Automatic categorization

---

## Technical Notes

### CSS Strategy
- Global styles in `src/styles.css`
- Component styles in co-located `.css` files
- Use CSS variables for theming
- Use `light-dark()` function for color mode
- Use CSS nesting where appropriate
- Use native `<dialog>` instead of JS modal libraries

### State Management
- TanStack Store for UI state (forms, dialogs)
- TanStack React Query for server state
- Keep stores minimal and focused
- Use React Query's cache for shared data

### File Structure
```
src/
├── components/
│   ├── auth/           # Auth components
│   ├── common/         # Shared components
│   ├── home/           # Home page components
│   ├── layout/         # Layout components
│   ├── reminders-list/ # List page components
│   ├── reminder-form/  # Form components
│   ├── modes/          # Mode management
│   └── alerts/         # Alert management
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login/
│   ├── register/
│   ├── reminders/
│   │   ├── index.tsx
│   │   ├── new/
│   │   └── $id/
│   │       └── edit/
│   └── settings/
│       ├── modes/
│       └── alerts/
├── lib/
│   ├── auth-client.ts
│   └── api.ts          # API utilities
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── store.ts
├── types.ts
└── styles.css
```

### API Utilities
Create a centralized API module:
```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_SERVER_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}
```

---

## Execution Priority

1. **Phase 0** - Fix auth bug (CRITICAL)
2. **Phase 1** - Route protection
3. **Phase 3** - Reminders list (core functionality)
4. **Phase 4** - Create/Edit reminders
5. **Phase 2** - Home page dashboard
6. **Phase 7** - Dialog system
7. **Phase 8** - Responsive design
8. **Phase 9** - UX enhancements
9. **Phase 5 & 6** - Settings pages
10. **Phase 10-12** - Testing, optimization, polish

---

*Last updated: February 2026*
