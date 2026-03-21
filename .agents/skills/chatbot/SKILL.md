---
name: Chatbot & GeminiChat Pattern
description: Detailed instructions and implementation patterns for the Chatbot Character Picker and the GeminiChat messaging interface in ReaderApp.
---

# Chatbot & GeminiChat Implementation

## Overview
The Chatbot system consists of two primary states: **Character selection** (Picker) and **Active messaging** (`GeminiChat`). It is designed to be accessible from any part of the app, including the Reader.

## Navigation & Transitions

### 1. Unified Access (Hamburger Menu)
When switching to Chatbot mode from the menu, the app must transition to the `idle` mode and `home` tab to render the chatbot UI.

**Standard Transition Logic:**
```tsx
onPress={() => {
    if (isChatbotMode) {
        setIsChatbotMode(false);
        if (readingSession) setAppMode('reader'); // Restore session
    } else {
        setAppMode('idle');
        setActiveTab('home');
        setIsChatbotMode(true);
    }
}}
```

## Component Architecture

### 1. Chatbot Character Picker (`renderChatbotHome`)
A 2-column grid for selecting specialized AI companions.
- **Layout**: `width: '48%'`, `aspectRatio: 1`.
- **Styling**: `borderRadius: 24`, `borderWidth: 1`, `theme.uiBg`.

### 2. GeminiChat Component (`GeminiChat.tsx`)
The primary messaging interface, featuring real-time interaction and educational tools.

#### Message Bubbles
- **Assistant**: Left-aligned, `theme.bubbleAI` background.
- **User**: Right-aligned, `primaryColor` background.
- **InteractiveText**: Used within bubbles to enable word lookups and natural reading.

#### Action Row (Assistant)
Contains tools for **TTS** (Text-to-Speech), **Language Switching**, and **Quick Ideas** (Brainstorming).

#### Interaction Modes
- **Keyboard Mode**: Standard text input.
- **Live Voice Mode**: Large mic button with recording/transcription feedback.

## Advanced Features

### 1. Quick Ideas (Brainstorming)
The lightbulb icon triggers a "hint" generator that suggests the next best reply for the user.
- **UI**: Displayed as an italicized `hintBubble` below the assistant's message.
- **Color**: `#f59e0b` (Amber).

### 2. Grammar Checker
The "check" button on user messages triggers a correction and teaching tip.
- **UI**: Displayed as a `correctionBubble` below the user's message.
- **Content**: Always includes a `Corrected:` version and a `Quick Tip:`.

### 3. TTS-Synced Scrolling (Follow Voice)
The chat interface automatically scrolls to keep the currently spoken word in the viewport.
- **Logic**: Calculates `viewPosition` on the `FlatList` based on `speechRange.start / message.length`.
- **Manual Override**: If `onScrollBeginDrag` is triggered, the follow logic pauses to allow the user to read history.
- **Smart Resume**: Follow logic re-enables when the user scrolls back to the bottom.

## Best Practices
1. **Glassmorphism**: Use semi-transparent backgrounds (`uiBg + '80'`) for hint bubbles to maintain a premium feel.
2. **Context Persistence**: When entering chatbot from the reader, ensure the `readingSession` is preserved so the user can "Switch to Reader" later.
3. **Accessibility**: Always include a "PhoneOff" or "End Session" action to clear AI state and stop TTS.
4. **Consistency**: Use `ResponsiveWrapper` to ensure the chat remains readable on tablets and larger screens.
