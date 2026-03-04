---
name: Quiz Feature Pattern
description: Detailed instructions and implementation patterns for the Quiz generation, rendering, and interaction logic in ReaderApp.
---

# Quiz Feature Implementation

## Overview
The Quiz feature in ReaderApp allows users to take AI-generated quizzes from textual contexts, images, or saved lists. The architecture focuses on stable state management, visual diagram generation, and AI response normalization.

## Key Components

### 1. State Management (`quizState`)
The entire active quiz session is driven by a single React state object (`quizState`), initialized via `setQuizState({...})`. It tracks:
- `questions`: Array of normalized question objects.
- `currentIndex`: The currently active question index.
- `score`: The user's current score.
- `completed`: Boolean indicating if the quiz is finished.
- `timeSpent`: Array tracking time spent on each question.
- `isExamMode`: Boolean freezing the UI into 'Exam' (no immediate feedback) vs 'Practice' (immediate explanation).

### 2. Memoized UI Components
To prevent sluggish navigation between questions, the UI relies on strictly memoized components:
- **`QuizNavButtons`**: Handles navigation (Previous, Next/Finish, Review).
- **`QuizOptionsList`**: Renders the multiple-choice options. Computes dynamic styling based on whether the `isExamMode` is active and if the user selected the correct option.
- **`QuizContentHeader`**: Displays the question references (like context text or AI-generated visual diagrams) and tracks `isGeneratingVisual` state.

### 3. Data Normalization and Resilience
Since the Quiz data comes from an LLM, its JSON output keys may vary (especially for non-English prompts like Hindi keys "prashn", "vyakhya").
- **`normalizeQuizKeys(questions)`**: A resilience function that scans the object keys. If standard keys (`question`, `options`, `explanation`, `correctOptionIndex`) are missing, it uses regex matches and type-checking (e.g., finding an array for `options`, finding a number for `correctOptionIndex`) to map unexpected keys back to the standard schema.
- **`randomizeQuizData(questions)`**: A Fisher-Yates shuffle algorithm that dynamically scrambles the `options` array and recalculates the `correctOptionIndex` to prevent LLM biases (like always putting the answer in Option A).

### 4. Visual Diagram Generation (`handleGenerateQuizVisual`)
Quizzes support AI-generated diagrams for visual learners.
- When an AI generates a quiz, it may populate `visualPrompt` for a question. 
- The UI displays a "Tap to load diagram" placeholder if `visualUri` is empty.
- When tapped, `handleGenerateQuizVisual` triggers an image generation API call using `visualPrompt`, sets `isGeneratingVisual: true`, and upon success, stores the image in `visualUri`.

### 5. Interaction Handlers
- **`handleQuizOptionSelect(questionIndex, optionIndex)`**: Updates the active question's `selected` property. If `isExamMode` is false, it reveals the explanation immediately.
- **Submit & Evaluation**: When reaching the end, users are prompted to finish. Only then is the complete `score` definitively calculated and the `completed` state flipped to `true`, displaying the result overlay.
