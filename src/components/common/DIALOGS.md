# Dialog System Documentation

The Reminders app uses a comprehensive dialog system built on native HTML `<dialog>` elements. This provides accessible, performant modals with animations and proper focus management.

## Available Dialog Components

### 1. Dialog (Base Component)

The base dialog component integrated with the global `dialogStore`. Used for custom content that doesn't fit other variants.

**Usage:**
```tsx
import { dialogStore } from "@/store";

// Open the dialog
dialogStore.setState({
  isOpen: true,
  onClose: () => {},
  children: <YourCustomContent />
});

// Close the dialog
dialogStore.setState({ isOpen: false, children: null });
```

### 2. ConfirmDialog

Use for confirmations, delete actions, or any decision that requires user acknowledgment.

**Props:**
- `isOpen`: boolean - Controls dialog visibility
- `title`: string - Dialog title
- `message`: string - Confirmation message
- `confirmText?`: string - Text for confirm button (default: "Confirm")
- `cancelText?`: string - Text for cancel button (default: "Cancel")
- `onConfirm`: () => void - Callback when confirmed
- `onCancel`: () => void - Callback when canceled
- `variant?`: "danger" | "warning" | "info" - Visual style (default: "info")

**Example:**
```tsx
import { ConfirmDialog } from "@/components/common";
import { useState } from "react";

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const onConfirm = () => {
    // Perform delete action
    console.log("Deleted!");
    setShowConfirm(false);
  };

  return (
    <>
      <button onClick={handleDelete}>Delete Item</button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={onConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
```

**Variants:**
- `danger` - Red color, for destructive actions (delete, remove)
- `warning` - Orange color, for actions that need caution
- `info` - Primary color, for general confirmations

### 3. AlertDialog

Use for simple notifications, success messages, or informational alerts that only require acknowledgment.

**Props:**
- `isOpen`: boolean - Controls dialog visibility
- `title`: string - Alert title
- `message`: string - Alert message
- `onClose`: () => void - Callback when closed
- `variant?`: "success" | "error" | "info" | "warning" - Visual style (default: "info")
- `closeText?`: string - Text for close button (default: "OK")

**Example:**
```tsx
import { AlertDialog } from "@/components/common";
import { useState } from "react";

function MyComponent() {
  const [showAlert, setShowAlert] = useState(false);

  const handleSuccess = () => {
    setShowAlert(true);
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>

      <AlertDialog
        isOpen={showAlert}
        title="Success!"
        message="Your reminder has been created successfully."
        variant="success"
        closeText="Got it"
        onClose={() => setShowAlert(false)}
      />
    </>
  );
}
```

**Variants:**
- `success` - Green, for successful operations
- `error` - Red, for errors or failures
- `warning` - Orange, for warnings
- `info` - Primary color, for general information

### 4. FormDialog

Use for inline forms like creating modes, alerts, or quick-add functionality.

**Props:**
- `isOpen`: boolean - Controls dialog visibility
- `title`: string - Form title
- `children`: ReactNode - Form content
- `onClose`: () => void - Callback when closed
- `onSubmit?`: (e: React.FormEvent) => void - Form submit handler
- `submitText?`: string - Text for submit button (default: "Submit")
- `cancelText?`: string - Text for cancel button (default: "Cancel")
- `showActions?`: boolean - Show submit/cancel buttons (default: true)
- `isSubmitting?`: boolean - Disable actions during submission (default: false)
- `closeOnBackdropClick?`: boolean - Allow closing by clicking backdrop (default: true)

**Example:**
```tsx
import { FormDialog } from "@/components/common";
import { useState } from "react";

function MyComponent() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit form data
      await submitData(formData);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowForm(true)}>Add Item</button>

      <FormDialog
        isOpen={showForm}
        title="Add New Item"
        submitText="Create"
        cancelText="Cancel"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={() => setShowForm(false)}
      >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </FormDialog>
    </>
  );
}
```

**Custom Actions:**
If you need custom form actions (e.g., different layout), set `showActions={false}` and add your own buttons:

```tsx
<FormDialog
  isOpen={showForm}
  title="Custom Form"
  showActions={false}
  onClose={() => setShowForm(false)}
>
  <form onSubmit={handleSubmit}>
    {/* Your form fields */}

    <div className="custom-actions">
      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
      <button type="submit">Save</button>
      <button type="submit" name="action" value="save-and-new">Save & Add New</button>
    </div>
  </form>
</FormDialog>
```

## Features

### Animations
All dialogs include smooth slide-in/fade-in animations on open and slide-out/fade-out on close.

### Accessibility
- Proper ARIA attributes (`aria-modal`, `aria-labelledby`, `aria-describedby`)
- Focus trapping (handled by native `<dialog>`)
- Escape key to close
- Keyboard navigation support

### Backdrop Click
All dialogs close when clicking outside the dialog content (on the backdrop). For FormDialog, this can be disabled with `closeOnBackdropClick={false}`.

### Focus Management
- ConfirmDialog: Focus on "Cancel" button by default (safer option)
- AlertDialog: Focus on "OK" button
- FormDialog: Focus naturally flows to first form field

## Styling

All dialog components follow the project's CSS guidelines:
- Use CSS custom properties for colors, spacing, shadows, etc.
- Support light-dark mode via `light-dark()` function
- Use `rem` units for accessibility
- Consistent class naming: `ComponentName__element`

## Migration Guide

If you have existing code using the global `dialogStore`, you can:

1. **Keep using it** for custom content that doesn't fit other variants
2. **Migrate to specific variants** for better semantics and UX:
   - Confirmations → `ConfirmDialog`
   - Alerts/notifications → `AlertDialog`
   - Forms → `FormDialog`

Example migration:
```tsx
// Before
dialogStore.setState({
  isOpen: true,
  children: (
    <div>
      <h2>Delete Item</h2>
      <p>Are you sure?</p>
      <button onClick={handleConfirm}>Yes</button>
      <button onClick={handleCancel}>No</button>
    </div>
  )
});

// After
<ConfirmDialog
  isOpen={showConfirm}
  title="Delete Item"
  message="Are you sure?"
  confirmText="Yes"
  cancelText="No"
  variant="danger"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

## Best Practices

1. **Choose the right variant**: Use the most specific dialog type for your use case
2. **Clear messages**: Use concise, action-oriented language
3. **Appropriate variants**: Use "danger" for destructive actions, "success" for confirmations
4. **Loading states**: Disable actions during async operations (`isSubmitting` in FormDialog)
5. **Cleanup**: Always close dialogs after actions complete
6. **Accessibility**: Ensure dialogs can be operated via keyboard alone
