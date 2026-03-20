---
name: Home Screen Redesign & Layout Pattern
description: Detailed instructions and implementation patterns for the Gemini-style home screen, including greeting logic, tool grid, search bar pinning, and keyboard height tracking.
---

# Home Screen Redesign & Layout Implementation

## Overview
The home screen is redesigned to mimic the Google Gemini interface, focusing on a clean, spacious aesthetic with a prominent greeting, a grid of actionable "suggestion chips" (tools), and a pill-shaped search bar pinned to the bottom.

## Component Architecture

### 1. Main Container Structure
The `activeTab === 'home'` view uses a `KeyboardAvoidingView` to wrap both the scrollable content and the pinned search bar.
- **Scrollable Area (`ScrollView`)**: Contains the greeting and the tool cards grid.
- **Pinned Area (`View`)**: Contains the pill-shaped search bar, placed **after** the `ScrollView` within the same `KeyboardAvoidingView`.

### 2. Grid Layout for Tools
Tools are rendered in a 2-column grid within the `ScrollView`.
- **Logic**: Use `flexDirection: 'row'` and `flexWrap: 'wrap'` on a container view.
- **Child Sizing**: Each tool card (`TouchableOpacity`) uses `width: '48%'` with `justifyContent: 'space-between'` and `gap: 12` to create the grid effect.

### 3. Pill-Shaped Search Bar
The search bar (`renderHomeSearchBar`) is a single `View` with:
- `borderRadius: 30` (pill shape).
- Reordered icons: Attach/Vision on the left, Voice/Search on the right.
- `paddingHorizontal: 16` and `paddingVertical: 12` for a premium, spacious feel.

## Key States & Dynamic Logic

### 1. Precision Keyboard Tracking (Android Fix)
Standard `KeyboardAvoidingView` behaviors (`padding`, `height`, `position`) often fail on Android due to device-specific navigation bars or OS resizing behaviors.
- **Implementation**:
  - `isKeyboardVisible` (Boolean): Tracks if the keyboard is active.
  - `keyboardHeight` (Number): Stores the exact pixel height from the `keyboardDidShow` event (`e.endCoordinates.height`).
- **Usage**: Apply `paddingBottom: Platform.OS === 'android' && isKeyboardVisible ? keyboardHeight : 0` to the `KeyboardAvoidingView` or the pinned search bar container to manually force it above the keyboard precisely.

### 2. Greeting & Language Toggle
The greeting uses `fontSize: 34` and `fontWeight: '800'`.
- **Logic**: The language name within the subtitle is an interactive `Text` element that calls `cycleGlobalLanguage`. This ensures the user can swap translation targets directly from the home screen.

## Best Practices & Patterns
1. **Remove Header Borders**: For the Gemini look, ensure `renderHeader` has `borderBottomWidth: 0` and the title is centered.
2. **Elevated Cards**: Tool cards should use subtle shadow logic (`shadowOpacity: 0.05` / `elevation: 2`) and large border radii (`borderRadius: 20`).
3. **Manual Padding**: On Android, always favor manual keyboard height tracking over native behaviors if the input is pinned to the bottom, to prevent clipping or overlapping.
