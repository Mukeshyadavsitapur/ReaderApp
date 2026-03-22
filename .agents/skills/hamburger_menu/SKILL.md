---
name: Hamburger Menu (Side Menu) Pattern
description: Detailed instructions and implementation patterns for the retractable side navigation menu in ReaderApp.
---

# Hamburger Menu (Side Menu) Implementation Pattern

The Hamburger Menu (referred to as "Side Menu" in the code) provides the primary navigation for the ReaderApp. It is implemented as an animated overlay that slides in from the left.

## Core Component

The menu is located in `app/index.tsx` (approx. line 23500) and uses `Animated.View` for its slide-in/out effect.

### Key Logic
- **Animation State**: Controlled by `sideMenuAnim` (typically an `Animated.Value` starting at `-280`).
- **Toggle Function**: `toggleSideMenu(isOpen: boolean)` starts the animation.
- **Placement**: Absolute positioning on the left, covering the height of the screen.

### Structure
```tsx
<Animated.View
    style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 280,
        backgroundColor: theme.bg,
        transform: [{ translateX: sideMenuAnim }],
        // ... shadow and border styles
    }}
>
    <ScrollView>
        {/* Navigation Items */}
        {/* Recent Activity Groups */}
        {/* Vocabulary Section */}
    </ScrollView>
</Animated.View>
```

## Navigation Items

The menu contains several primary navigation buttons using the `styles.menuItem` pattern:

1. **New Session**: Resets `appMode` to 'idle' and `activeTab` to 'home'.
2. **Notes**: Switches `activeTab` to 'notes'.
3. **Chatbot**: Toggles `isChatbotMode`. Includes sub-options for "Live Chatbot Mode" when active.
4. **Dictionary**: Switches `activeTab` to 'dictionary'.
5. **Quiz**: Configures the 'examiner' tool and sets `appMode` to 'setup'.
6. **Studio**: Switches `activeTab` to 'story'.
7. **Library**: Switches `activeTab` to 'library'.

## Specialized Sections

### Recent Activity
Displays grouped chat sessions (Today, Yesterday, etc.) using the `renderGroup` helper. Sessions are limited in number, with a "Manage all activity" button at the bottom linking to the full Library.

### Vocabulary Section
Lists recent dictionary searches.
- Shows up to 10 recent words.
- Each word links to a Flashcards session (`setAppMode('flashcards')`).
- Includes a "Manage all words" button linking to the Dictionary tab.

## Styling Rules

- **Width**: Hardcoded to 280 for consistent experience.
- **Active State**: Active items should use `theme.highlight` as a background color.
- **Icons**: 
    - **Standard Items**: Use lucide icons (size 20) with `primaryColor`.
    - **Custom Features**: If `char.isCustom` is true, use a circular background with the first character of the title.
    ```tsx
    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: primaryColor + '10', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: primaryColor + '20' }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: primaryColor }}>
            {feature.title.charAt(0).toUpperCase()}
        </Text>
    </View>
    ```
- **Text**: Primary labels use `theme.text`, secondary text uses `theme.secondary`.
- **Buttons**: All buttons should be wrapped in `TouchableOpacity` with consistent padding.

### Management Buttons
Buttons for "Manage all activity" and "Manage all words" follow a specific minimalist style:
- **No Icons**: Unlike primary navigation items, these buttons do not have leading icons.
- **Font Styling**: `color: theme.primary`, `fontWeight: '700'`, `fontSize: 12`.
- **Centering**: The text is typically centered within its touch area.
- **Logic**: 
    - "Manage all activity" links to the Library tab.
    - "Manage all words" links to the Dictionary tab.

## Data Availability & Hydration

The side menu relies on `chatSessions` (Recent Activity) and `recentSearches` (Vocabulary) being populated to show relevant history.

### Startup Loading
To ensure "Recent Activity" is visible immediately after an app refresh/reload (before the user visits the Library tab):
- **Background Hydration**: The app must trigger a background load of session metadata on startup.
- **Implementation**: Call `loadLibraryPage()` (or equivalent metadata fetcher) within a global `useEffect` that runs on mount.
- **Vocabulary Recovery**: Ensure `recentSearches` is loaded from persistent storage (FileSystem/AsyncStorage) during the initial sanitization phase.

## Reference Files
- [app/index.tsx](file:///e:/ReaderAppGit/app/index.tsx) - Main implementation including `sideMenuAnim`, `renderSideMenu`, and startup `useEffect` with `loadLibraryPage()`.
