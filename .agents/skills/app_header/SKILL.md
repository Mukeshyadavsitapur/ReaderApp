---
name: App Header Management Pattern
description: Detailed instructions and implementation patterns for the global app header, including title responsiveness, mode-switching logic, and button alignment.
---

# App Header Management Pattern

The App Header is the primary top-level navigation and state-display component in ReaderApp. It is implemented within the main `Index` component in `app/index.tsx`.

## Header Structure

The header uses a three-column layout to ensure consistent placement of predictable navigation elements:

1. **Left Section (`flex: 1`)**:
   - Contains the Hamburger Menu icon (`Menu`) for main navigation.
   - Switches to a Back arrow (`ArrowLeft`) when in nested sub-views or modes that require a step back.
2. **Center Section (`flex: 3`)**:
   - Displays the current page title, reading session title, or quiz title.
   - **Responsiveness Rule**: To prevent overlap with dense button clusters in the right section, the title is conditionally hidden in high-density modes like `live` quiz mode.
3. **Right Section (`flex: 1`)**:
   - Displays mode-specific buttons (e.g., Language switch, Timer, Settings, or Close actions).
   - Alignment: `flex-end` with a `row` direction and consistent `gap: 10`.

## Best Practices for Header Modifications

### 1. Title Truncation
Always use `numberOfLines={1}` and manual substring truncation for titles to prevent vertical expansion:
```tsx
{readingSession.title.length > 28 ? readingSession.title.substring(0, 28) + '...' : readingSession.title}
```

### 2. Preventing Overlap
When adding many buttons to the `rightAction` container, evaluate if the center title should be hidden or further truncated.
- **Rule**: In `appMode === 'live'`, the center title must be hidden to provide maximum space for the timer and language switcher.
- **Rule**: In `activeTab === 'notes'` while `isEditingNote` is true, the center title must be hidden to avoid overlap with undo/redo and utility icons.

### 3. Dynamic Styling
The header background (`headerBg`) and text colors (`headerTextColor`) should dynamically respond to the `theme.id` or `isDay` boolean:
- **Day Mode**: Usually uses `theme.primary` for high contrast.
- **Night/Other Modes**: Usually uses `theme.uiBg` or `theme.bg` for a more integrated look.

## Core Implementation Details

The header is rendered around line 21710 in `app/index.tsx`. It relies on several variables computed just before the return:
- `displayTitle`: The text to show in the center.
- `rightAction`: A JSX element containing the right-side buttons.
- `closeAction`: The function to call when the "X" button is pressed.

## Reference Files
- [app/index.tsx](file:///e:/ReaderAppGit/app/index.tsx) - Main header rendering logic and mode-switching.
