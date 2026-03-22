---
name: Reader Component & Content Rendering Pattern
description: Detailed instructions and implementation patterns for the multi-modal Reader, including InteractiveText parsing, SimpleTable handling, ConceptCards, and justified text alignment.
---

# Reader Component & Content Rendering Implementation

## Overview
The Reader is the core content consumption interface of ReaderApp. It is designed for high readability, interactivity (tap-to-define), and support for complex data types like tables and math formulas.

## Core Components

### 1. InteractiveText (`components/common/InteractiveText.tsx`)
The primary engine for rendering prose with embedded formatting and interactivity.

- **Text Alignment**: Uses `textAlign: 'justify'` by default for a premium, book-like feel.
- **Parsing Logic**: Uses regex-based segmentation to handle:
    - **Headers**: Lines starting with `#`.
    - **Quotes**: Lines starting with `>`.
    - **Code Blocks**: Fenced with ` ``` `.
    - **Formulas**: Centered, italicized text for mathematical expressions (handles both `$$` and standalone math symbols).
    - **Inline Formatting**: Bold (`**`), Italic (`*`), and Markdown Links (`[text](url)`).
- **Interactivity**: 
    - **Tap-to-Define**: Wraps words in `<Text>` nodes to catch `onPress` events for dictionary lookup.
    - **TTS Highlighting**: Highlights the "active sentence" using a background color from the theme.
    - **Manual Highlights**: Persists user-selected highlights.

### 2. SimpleTable (`app/index.tsx`)
A responsive data grid used for structured information within documents.

- **Alignment**: Headers are `center` aligned, while body cells are `left` aligned (never justified to prevent layout breaks).
- **Resizing**: Supports manual column width adjustment on Android via a custom slider.
- **Visibility**: Supports `initiallyHidden` prop with a "Show Answers" toggle for educational content.

### 3. ConceptCard (`app/index.tsx`)
Renders bite-sized, high-importance concepts with custom styling.

- **Interactivity**: Inherits `InteractiveText` capabilities (lookup, TTS) but with a card-like container (`borderRadius: 16`, distinct background).

## Rendering Flow in `app/index.tsx`

### Data Structure
The reader operates on a list of `Paragraph` objects (usually `readingParagraphs`). Each paragraph has a `type` (`text`, `table`, `concept-card`) and an `offset` for tracking global text position.

### `renderReaderItem` (The Dispatcher)
A memoized function that determines which component to render based on `item.type`.
- **Unified Rendering Architecture**: The `generating` (stream) and `reader` modes share the exact same `FlatList` component. The `data` prop dynamically switches between `generationData` (for streaming) and `readerParagraphs` (upon completion). This prevents unmounting and eliminates the "content refresh" blink.
- **Key Pattern**: Always provide a `key` that includes `theme.id` to force a full re-render when switching between Day and Night modes.
- **Style Synchronization**: Typography styles (font family, size, line height) are applied identically to both the streaming state and the reader paragraphs. Use `getTypographyStyle` to ensure font parity.
- **Paragraph Grouping**: Text is flushed into `InteractiveText` blocks only on double-newline `\n\n` boundaries to maintain logical grouping (e.g., lists and multi-line explanations).

## Offline Capabilities & AI Integration

### 1. Offline Mode Details
When no API key is present:
- **Available**: Reading existing history, viewing saved notes, basic dictionary lookup, and PDF/Text file parsing.
- **Unavailable**: AI Chat, Image Translation, Quiz Generation, and advanced brainstorming.
- **User Notification**: Use `handleWifiPress` to inform users about offline limitations and provide a shortcut to Settings.

### 2. Machine Learning Notes
- **Naming**: If a user suggests a new name for a ML chapter, update both the session title and the hamburger menu entry.
- **Visuals**: ML concepts should prioritize `ConceptCard` and `SimpleTable` for visibility. Use original formula styles (e.g., `f_{w,b}(x) = wx + b`) without unnecessary LaTeX wrappers in the raw text where possible.

## Best Practices
1. **Line Height**: Use a generous `lineHeight` (default `28 * fontSize`) for better legibility.
2. **Justification**: Always use `textAlign: 'justify'` for standard text blocks in the reader.
3. **Accessibility**: Ensure `selectable` is `true` unless `isHighlightMode` is active to avoid gesture conflicts.
4. **Performance**: Wrap `InteractiveText` in `React.memo` with a custom comparison function to prevent expensive re-renders during TTS playback.
