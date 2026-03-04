---
name: Offline Speech-to-Text (STT) Pattern
description: Detailed instructions and implementation patterns for the Offline STT function using expo-speech-recognition in ReaderApp.
---

# Offline Speech-to-Text (STT) Implementation

## Overview
This application uses `expo-speech-recognition` for its offline STT (Speech-to-Text) capabilities. The implementation is designed to handle cross-platform discrepancies between iOS and Android, manage permissions efficiently, and provide a Live Chatbot mode that uses volume-based silence detection.

## Key Components

### 1. States and Refs
The implementation relies heavily on `useRef` to maintain consistency across asynchronous OS events without triggering unnecessary React renders.
- `offlineTranscript` (State): Holds the current visible transcript to update the UI.
- `latestOfflineTranscriptRef` (Ref): Holds the absolute latest transcript, referenced safely during `end` or `error` callbacks.
- `accumulatedOfflineTranscriptRef` (Ref): Stores previously confirmed speech from `isFinal` events. This is crucial for properly appending partial sentences and neutralizing differences between iOS (which frequently clears memory) and Android (which accumulates natively).
- `sttPermissionGranted` (Ref): Caches the microphone permission grant to skip the ~1s OS permission round-trip on subsequent usages.
- `chatbotSilenceTimer` (Ref): Used in Live Chatbot mode to automatically stop the microphone after prolonged silence.

### 2. Event Listeners (`useSpeechRecognitionEvent`)
The STT lifecycle is managed exclusively through event listeners:
- **`start`**: Resets all state and accumulator refs, and switches the UI to recording mode.
- **`result`**:
  - Takes only the highest-confidence transcript (`event.results?.[0]?.transcript`) to avoid Android's bug of duplicating alternative context guesses.
  - Compares the incoming string with `accumulatedOfflineTranscriptRef`. If it starts with the accumulator, it replaces it (native accumulation). If it doesn't, it prepends the accumulator (fresh context).
- **`volumechange`**: 
  - Monitors the microphone volume (values typically range between -2 and 10).
  - Actively checks if the volume drops below the `4.5` threshold (silence). If it stays silent beyond `silenceTimeoutMs` (e.g., 3000ms), it automatically stops recording.
- **`end` / `error`**: Cleans up silence timers and resolves the main `getOfflineSTT()` promise.

### 3. Core Methods
- **`getOfflineSTT()`**: 
  - Validates module existence and permissions.
  - Registers the custom `resolve` function to a ref so the event listeners can fulfill the promise.
  - Starts the engine with `continuous: true` and enables `volumeChangeEventOptions`.
- **`stopOfflineSTT()`**: 
  - Optimistically updates UI states instantly to remove the 2-3s input lag caused by the OS terminating the mic sequentially.
  - Calls `ExpoSpeechRecognitionModule.stop()`.

## Best Practices & Handling Gotchas
1. **Prevent Android Duplication**: Never blindly concatenate all elements in the `event.results` array. Always grab just `[0]`, otherwise text duplicates like "Ram eats food, Ram eats food ramesh goes to...".
2. **Handle Context Disconnects**: iOS and Android differ on how they aggregate text over a long continuous session. Always use a custom JS-side `accumulatorTarget` to merge `isFinal` parts securely.
3. **Manual Silence Detection**: Do not trust the native OS silence timeout as it often cuts off trailing speech abruptly. Use `continuous: true` and calculate silence manually using the `volumechange` event instead.
4. **Optimistic State Toggles**: Trigger `.stop()` inside `try/catch` and immediately toggle UI buttons to `false` instead of waiting for the `end` event to make the application feel highly responsive.
