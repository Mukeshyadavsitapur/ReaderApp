---
name: Voice Input & Mic Integration Pattern
description: Rules and patterns for rendering mic buttons and accurately routing voice-to-text input to various state fields in ReaderApp.
---

# Voice Input Integration Pattern

## Overview
ReaderApp uses a centralized system to handle voice input across dozens of unique screens. The core philosophy is to **avoid programmatic auto-focus** (which forces the keyboard open) and instead rely on **explicit state routing** based on a `target` identifier.

## Core Components

### 1. `renderMicButton(target, customStyle?, iconSize?)`
This helper function should be used to render ANY microphone button in the application.

- **`target`**: A unique string identifier for the destination input (e.g., `'search'`, `'note_prompt'`).
- **Functionality**: 
  - Toggles `handleVoiceToggle(target)`.
  - Automatically handles the "Pulse" animation and `ActivityIndicator` during transcription.
  - Matches `voiceTarget` state to determine if it is the currently active listener.

### 2. `handleVoiceToggle(target)`
The main entry point for starting/stopping speech recognition.

- **Keyboard Management**: Always calls `Keyboard.dismiss()` at the start. Never call `.focus()` on a `TextInput` here to keep the viewport clear for the user while they speak.
- **Provider Switching**: Automatically handles fallback between Google Gemini (Online) and `expo-speech-recognition` (Offline) if API keys are missing or quotas are hit.

### 3. `applyVoiceText(target, text)`
The "Router" that determines exactly which React state variable gets updated with the result.

```typescript
const applyVoiceText = (currentTarget: string, text: string) => {
    const newText = text.trim();
    if (!newText) return;
    
    // Mapping Examples:
    if (currentTarget === 'note_title') setCurrentNoteTitle(prev => (prev ? prev + " " : "") + newText);
    else if (currentTarget === 'note_prompt') setCustomNotePrompt(prev => (prev ? prev + " " : "") + newText);
    // ... defaults to Search logic
    else setQuickSearchQuery(prev => (prev ? prev + " " : "") + newText);
};
```

## Supported Targets Reference
When adding a new mic button, you MUST add its target to the `applyVoiceText` switch-case:

| Target ID | Destination State | Feature Area |
| :--- | :--- | :--- |
| `search` | `setQuickSearchQuery` | Home Search |
| `note_title` | `setCurrentNoteTitle` | Note Editor |
| `note_prompt` | `setCustomNotePrompt` | Notes AI Tools |
| `note_body` | `setCurrentNoteInput` | Note Editor |
| `story_title` | `setBookParams.title` | Story Generator |
| `dictionary` | `setDictionaryInput` | Dictionary View |
| `library_search` | `setLibrarySearchQuery` | Library Tab |
| `notes_search` | `setNoteSearchQuery` | Notes Tab |
| `editorial_topic` | `setEditorialParams.topic` | Editorial Tool |

## Best Practices
1. **Never use `ref.current.focus()`**: Programmatic focusing triggers the OS keyboard which covers the UI. Use `Keyboard.dismiss()` instead.
2. **Always prepend/append with space**: When updating state, check if `prev` exists and add a space (`" "`) before appending the `newText` to preserve sentence structure.
3. **Use `voiceTarget` for UI feedback**: The `renderMicButton` uses `voiceTarget === target` to show the active red/pulsing state. Ensure the `target` passed to the button matches the one handled in the router.
4. **Hermes Safety**: Always use optional chaining (`?.`) and nullish coalescing (`?? false`) inside `useMemo` search filters to prevent `TypeError` crashes on missing content.
