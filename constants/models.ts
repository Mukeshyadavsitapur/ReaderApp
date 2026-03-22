export const GEMINI_MODELS = [
    "gemini-3.1-pro",
    "gemini-3-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.0-pro-exp-02-05", // Experimental / Stable fallback
    "gemini-2.0-flash-exp"
];

export const GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3-32b",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "moonshotai/kimi-k2-instruct-0905",
    "groq/compound",
    "groq/compound-mini",
    "meta-llama/llama-4-scout-17b-16e-instruct"
];

export const GEMINI_IMAGE_MODELS = [
    "imagen-3.5"
];

export const GROQ_IMAGE_MODELS = [
    "dall-e-3"
];

export const IMAGE_MODELS = [
    ...GEMINI_IMAGE_MODELS,
    ...GROQ_IMAGE_MODELS
];
