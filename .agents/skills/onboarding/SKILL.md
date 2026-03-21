---
name: Onboarding & Welcome Guide Pattern
description: Detailed instructions and implementation patterns for the initial user profile setup (OnboardingModal) and the interactive Welcome Guide in ReaderApp.
---

# Onboarding & Welcome Guide Pattern

This document outlines the implementation of the user's first experience in ReaderApp, covering the initial profile setup and the subsequent interactive welcome guide.

## Overview

The onboarding flow consists of two main phases:
1. **Initial Profile Setup (`OnboardingModal`)**: Captures user details like name, profession, and goals.
2. **Interactive Welcome Guide**: A special reader session that explains app features using the content captured in phase 1.

## Components

### 1. [OnboardingModal](file:///e:/ReaderAppGit/app/index.tsx#L4652)
- **Purpose**: A full-screen modal that appears for new users (`displaySettings.isOnboarded === false`).
- **Fields**: `userName`, `userProfession`, `userGoal`, `userBio`.
- **Logic**: Saves user data to persistent settings via `saveSettings` and transitions the app to the "Welcome Guide".

### 2. [OnboardingPreviewFooter](file:///e:/ReaderAppGit/app/index.tsx#L4757)
- **Note**: This footer is designed for AI setup (Groq/Gemini API keys) during onboarding.
- **Current Behavior**: Hidden from the "Welcome Guide" to simplify the first experience, but still used in the codebase for AI configuration during preview modes.

### 3. Welcome Guide Content (`ONBOARDING_GUIDE_MARKDOWN`)
- **Location**: Defined at [app/index.tsx:L1379](file:///e:/ReaderAppGit/app/index.tsx#L1379).
- **Structure**: Markdown content that introduces the user to the reader interface. It is loaded into a special `readingSession` with `id: "onboarding_guide"`.

## State & Flow Management

### Detection & Trigger
The app checks `displaySettings.isOnboarded` on startup.
```typescript
{/* Onboarding Modal Trigger */}
<OnboardingModal
    visible={isSettingsLoaded && displaySettings.isOnboarded === false && isInOnboardingPreview === false}
    ...
/>
```

### Transition to Welcome Guide
When the user clicks "Next: Explore App" in the modal:
1. User data is saved provisionally.
2. `setIsInOnboardingPreview(true)` is set.
3. `setAppMode("reader")` is set.
4. `setReadingSession` is initialized with the `onboarding_guide`.

### Completion Flow
During the `isInOnboardingPreview` state:
- The reader's header shows a **"Finish"** button instead of standard actions.
- Tapping **"Finish"** calls `saveSettings({ isOnboarded: true })`, which permanently marks the user as onboarded and dismisses the guide.

## UI Considerations

- **Search Bar**: Remains visible during onboarding to show users where they will interact with the AI later.
- **AI Setup**: Moved to the **Settings** tab to reduce friction during the initial walkthrough.
- **Personalization**: The guide content can be dynamically adjusted based on the `userGoal` and `userProfession` captured in the modal (future recommendation).

## Best Practices
- **Beginner Friendly**: Keep onboarding copy concise and encouraging.
- **State Isolation**: Use `isInOnboardingPreview` to distinguish the welcome guide from regular reader sessions.
- **Clear CTA**: Ensure the "Finish" button is always accessible in the header during the guide.
