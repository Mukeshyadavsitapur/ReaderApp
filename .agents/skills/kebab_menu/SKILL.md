---
name: Reader Kebab Menu
description: Patterns for the consolidated right-aligned header menu in Reader mode.
---

# Reader Kebab Menu Pattern

This skill documents the implementation of the consolidated "kebab" menu in the Reader mode of ReaderApp. This menu replaces individual header buttons with a single, elegant icon providing access to all tools.

## Implementation Details

### Location
The menu is integrated directly into the `renderHeader` function within `app/index.tsx`. This ensures proper scoping and access to local session-based helper functions (like `handleReaderDiscovery`, `switchReaderLanguage`, etc.).

### Trigger Button
- **Icon**: `MoreVertical` from `lucide-react-native`.
- **Position**: Far right of the header.
- **Styling**: Uses `readerBtnStyle` for consistent sizing and touch targets.

### State Management
- **Visibility**: Managed by the `isReaderMenuVisible` boolean state.
- **Toggle**: `setIsReaderMenuVisible(true/false)`.

### Menu Structure
The menu is implemented using a `Modal` component:
- **Backdrop**: A `TouchableOpacity` covering `flex: 1` with `backgroundColor: 'rgba(0,0,0,0.4)'` to provide a dimmed background that enhances focus.
- **Container**: A `View` positioned to the top-right, using `theme.uiBg` for an opaque, premium look.
- **Scrollable Content**: A `ScrollView` containing `TouchableOpacity` items for each action.

## Menu Items & Actions
Each menu item consists of an icon and a label. Standard items include:
- `Discovery`: `Sparkles` icon -> `handleReaderDiscovery()`
- `Highlighter`: `Highlighter` icon -> `toggleHighlighter()`
- `Language`: `Translation` display -> `switchReaderLanguage()`
- `Edit`: `PenLine` icon -> `setIsEditingNote(true)`
- `Export`: `Download` icon -> `handleReaderExport()`
- `Share`: `Share2` icon -> `onShare()`
- `Appearance`: `Palette` icon -> `setShowAppearance(true)`
- `Audio Upload`: `Music` icon -> `handleUploadAudio()`
- `TTS/Audio Playback`: `Volume2`/`Square` icon -> TTS logic.
- `Minimize` (Landscape only): `Maximize2` icon -> Closes expanded search.
- `Exit Reader`: `X` icon (`#ff4444`) -> `handleClose()`

## Styling Tokens
- **Backdrop**: `rgba(0,0,0,0.4)`
- **Menu Background**: `theme.uiBg` (Opaque)
- **Item Text**: `theme.text`
- **Border**: `theme.border`
- **Highlight Text**: `primaryColor`

## Modification Guide
To add a new feature to the reader header:
1. Locate `renderHeader` in `app/index.tsx`.
2. Find the `Modal` section where `isReaderMenuVisible` is true.
3. Insert a new `TouchableOpacity` with the `styles.menuItem` style.
4. Use a descriptive icon from `lucide-react-native` and a corresponding text label.
5. Ensure `setIsReaderMenuVisible(false)` is called in the `onPress` handler before executing the action.
