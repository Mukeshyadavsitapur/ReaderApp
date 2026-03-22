---
name: Reader Floating Controls
description: Patterns for floating action buttons (FABs) in the Reader interface, ensuring high-priority tools are always accessible.
---

# Reader Floating Controls Pattern

This skill documents the implementation and design of floating action buttons (FABs) within the Reader interface. FABs are used for high-frequency actions that require instant access without opening a menu.

## Implementation Details

### Placement
Floating controls are placed using `position: 'absolute'` at the top level of the reader container (Portrait) or the reader content view (Landscape).
- **Z-Index**: Always set `zIndex: 100` or higher to ensure visibility over the `FlatList` and other components.
- **Top Offset**: Typically `15px` from the top.
- **Side Offset**: Typically `15px` from the right edge.

### Component Structure
Each FAB is a `TouchableOpacity` with the following standard styling:
- **Dimensions**: `40x40` or `44x44`.
- **Shape**: `borderRadius: 20` (Circular).
- **Surface**: `backgroundColor: theme.uiBg` with a subtle `borderWidth: 1` and `borderColor: theme.border`.
- **Elevation**: Uses `shadowColor`, `shadowOpacity: 0.2`, `shadowRadius: 4`, and `elevation: 5` for a "floating" effect.

## Feature: Floating Audio Button

The primary example of a reader FAB is the "Play Audio" button.

### Logic & State
The button uses a combination of `ttsStatus`, `playingMeta`, and `isCustomAudioPlaying` to determine its behavior and appearance.

- **On Press**:
    1. If stopped: Checks if a custom audio file exists for the session; if so, plays it. Otherwise, triggers `speak()` for the main content.
    2. If playing: Calls `stopTTS()` and `stopCustomAudio()`.
- **Dynamic Icons**:
    - **Loading**: `ActivityIndicator` (when `isTtsDownloading` is true).
    - **Playing**: `Square` icon (when state is `playing` and IDs match).
    - **Stopped**: `Volume2` icon (default state).

### Orientation Handling
The FAB must be implemented in both orientation branches:
1. **Landscape**: Placed within the reader's main `View` (sibling to `FlatList`).
2. **Portrait**: Placed within the `KeyboardAvoidingView` wrapper, directly after the `FlatList`.

## Best Practices
1. **Contrast**: Use `primaryColor` for icons to make them pop against the `theme.uiBg`.
2. **Feedback**: Always provide visual feedback (like the `ActivityIndicator`) for async actions like TTS generation.
3. **Accessibility**: Use appropriate touch target sizes (minimum 44x44 recommended).
