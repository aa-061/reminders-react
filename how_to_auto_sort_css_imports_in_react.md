# How to Auto-Sort CSS Imports to the Top in React

This guide explains how to automatically move all CSS file imports to the top of your React TypeScript files using Prettier.

## Problem

By default, import statements in React files can be in any order. This guide helps you configure your project so that CSS imports are always at the very top of each file, and the sorting happens automatically when you save a file.

## Solution Overview

We use **Prettier** with the `@trivago/prettier-plugin-sort-imports` plugin to automatically sort imports with CSS files at the top.

---

## Step-by-Step Setup

### 1. Install Required Packages

Install Prettier and the import sorting plugin:

```bash
npm install --save-dev prettier @trivago/prettier-plugin-sort-imports
```

### 2. Create Prettier Configuration

Create a `.prettierrc` file in your project root:

```json
{
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": [
    "^.+\\.css$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^\\.\\.(/.*|$)",
    "^\\./(.*)$"
  ],
  "importOrderSeparation": false,
  "importOrderSortSpecifiers": true,
  "importOrderParserPlugins": ["typescript", "jsx"]
}
```

**Configuration Explanation:**
- `"^.+\\.css$"` - Matches all CSS imports and places them first
- `<THIRD_PARTY_MODULES>` - External packages from node_modules
- `"^@/(.*)$"` - Path alias imports (if you use `@/` aliases)
- `"^\\.\\.(/.*|$)"` - Parent directory imports (`../`)
- `"^\\./(.*)$"` - Same directory imports (`./`)
- `importOrderSeparation: false` - No empty lines between import groups
- `importOrderSortSpecifiers: true` - Sort named imports alphabetically

### 3. Configure VSCode Auto-Format on Save

Create or update `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

**Important:** Make sure you have the **Prettier VSCode extension** installed:
- Extension ID: `esbenp.prettier-vscode`
- Install it from the VSCode Extensions marketplace if you haven't already

### 4. Add NPM Script for Bulk Formatting

Add this script to your `package.json`:

```json
{
  "scripts": {
    "sort-imports": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

This allows you to format all files at once by running:

```bash
npm run sort-imports
```

---

## Usage

### Automatic Formatting (Recommended)

Once configured, simply **press Command+S (Mac) or Ctrl+S (Windows/Linux)** to save your file, and imports will automatically be sorted with CSS at the top.

### Manual Formatting

To format all files in your project at once:

```bash
npm run sort-imports
```

---

## Example

### Before:

```typescript
import { useState } from "react";
import { MyComponent } from "./MyComponent";
import "./App.css";
import axios from "axios";
```

### After (automatically sorted on save):

```typescript
import "./App.css";
import axios from "axios";
import { useState } from "react";
import { MyComponent } from "./MyComponent";
```

---

## Verification

To verify the setup is working:

1. Open any `.tsx` or `.ts` file
2. Rearrange the imports so CSS is NOT at the top
3. Press **Command+S** (Mac) or **Ctrl+S** (Windows/Linux)
4. The CSS import should automatically move to the top

---

## Troubleshooting

### Auto-format on save isn't working

1. Ensure the Prettier VSCode extension is installed (`esbenp.prettier-vscode`)
2. Reload VSCode window (Command+Shift+P → "Reload Window")
3. Check that `.vscode/settings.json` exists in your project root
4. Verify `.prettierrc` file exists in your project root

### Imports aren't being sorted

1. Run `npm run sort-imports` to verify Prettier is working
2. Check the terminal for any error messages
3. Ensure `.prettierrc` is valid JSON (no syntax errors)

### CSS imports aren't going to the top

1. Verify the `importOrder` in `.prettierrc` has `"^.+\\.css$"` as the first item
2. Run `npm run sort-imports` manually to test
3. Check that your CSS files end with `.css` extension

---

## Summary

This configuration provides:

✅ Automatic CSS import sorting to the top
✅ No manual intervention required
✅ Works on save (Command+S / Ctrl+S)
✅ No error messages or linting warnings
✅ Consistent import order across the entire project
✅ Bulk formatting with `npm run sort-imports`

---

## Files Created/Modified

1. `.prettierrc` - Prettier configuration
2. `.vscode/settings.json` - VSCode workspace settings
3. `package.json` - Added `sort-imports` script

That's it! Your React project now automatically sorts CSS imports to the top.
