---
name: Educational Content & ML Notes Pattern
description: Detailed instructions for generating beginner-friendly offline chapters, machine learning notes, and interactive educational content with diagrams, examples, and correctly formatted formulas.
---

# Educational Content & ML Notes Generation

## Overview
ReaderApp is designed for deep learning. All generated educational content, especially "Offline Chapters" or "Machine Learning Notes," must adhere to high pedagogical standards.

## Core Requirements

### 1. Beginner-Friendly Structure
- **Depth**: Even if a topic is complex, start with a high-level, clear analogy.
- **Examples**: Provide at least 2-3 practical, relatable examples for every new concept.
- **Clarity**: Avoid jargon unless explained immediately.

### 2. Machine Learning Notes
- **Visual Policy**: Do NOT prompt the LLM to generate `IMAGE_PROMPT` tags for standard articles, book chapters, or machine learning notes. This saves generation time and prevents layout shifts.
- **Exceptions**: Automatic image generation is reserved ONLY for **Quizzes** (where visuals are requested on-demand for specific questions).
- **Interactive Elements**: Use `ConceptCard` for key definitions and `SimpleTable` for comparisons (e.g., Supervised vs. Unsupervised Learning).

### 3. Formula Formatting
- **Standard**: Do NOT use LaTeX delimiters like `$$` or `\[`.
- **Style**: Use original mathematical symbols (e.g., `f_{w,b}(x) = wx + b`).
- **Cleanliness**: Remove unnecessary special characters and keep formulas on their own lines for maximum readability.

## Implementation Workflow

### 1. Context Injection
- When generating a chapter, check the user's profile (`displaySettings`) for their profession and goal to tailor the examples (e.g., if they are an engineer, use engineering analogies).

### 2. Output Formatting
- **Headers**: Always include a `# Title` header at the very beginning of the content. ReaderApp will no longer automatically strip or delete the first H1 header, ensuring a seamless transition from stream to static view.
- **Lists**: Use bullet points for feature comparisons.
- **Tables**: Use `SimpleTable` format for data-heavy sections (Strictly: No alignment colons `:---`).

## Best Practices
1. **No Placeholders**: Never use placeholder text like "[Insert Image Here]". Always use the `generate_image` tool or describe the visual in detail if the tool is unavailable.
2. **Offline Ready**: Ensure the generated content is substantial enough to be useful without a live connection (e.g., includes definitions, examples, and summaries).
3. **Typography**: Prioritize line height and font size settings from `displaySettings` when calculating layout (handled automatically by `InteractiveText`).
