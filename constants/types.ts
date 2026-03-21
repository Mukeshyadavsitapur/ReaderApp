// e:\ReaderAppGit\constants\types.ts

export interface Theme {
    id: string;
    bg: string;
    text: string;
    primary: string;
    secondary: string;
    highlight: string;
    uiBg: string;
    buttonBg: string;
    border: string;
    error: string;
    headerBg: string;
    headerText: string;
    badgeBg: string;
    badgeText: string;
    inputBg: string;
    logoBg: string;
    logoText: string;
    toolColor: string[] | null;
    activeWord: string;
    bubbleUser: string;
    bubbleAI: string;
    statusBarStyle: "light-content" | "dark-content";
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'ai';
    content: string;
    timestamp?: string | number;
}

export interface Highlight {
    start: number;
    end: number;
    text: string;
    color: string;
    id: string;
}

export interface FlashcardItem {
    id: string;
    word: string;
    definition: string;
    timestamp?: string | number;
    front?: string;
    back?: string;
    source?: string;
}

export interface ChatSession {
    id: string;
    toolId: string;
    title: string;
    timestamp: string | number;
    messages: Message[];
    pinned?: boolean;
    hasAudio?: boolean;
    image?: string;
    highlights?: Highlight[];
    items?: FlashcardItem[];
    images?: string[];
    score?: number;
    attempts?: number;
    completed?: boolean;
    currentIndex?: number;
    quizData?: any[];
    totalQuestions?: number;
    totalTime?: number;
    contentPath?: string;
    partNumber?: number;
    lastOpened?: string | number;
    type?: string;
    [key: string]: any;
}

export interface SavedQuestion {
    id: string;
    question: string;
    options?: string[];
    correctOptionIndex?: number;
    explanation?: string;
    visualPrompt?: string;
    visualUri?: string;
    timestamp: string | number;
    front?: string;
    back?: string;
}

export interface SavedWord {
    word: string;
    definition: string;
    timestamp: string | number;
    examples?: string[];
    id?: string;
}

export interface DisplaySettings {
    theme: string;
    fontSize: number;
    fontFamily: string;
    textStyles: string[];
    language: string;
    voice: string;
    tapToDefine: boolean;
    questionsLimit?: number;
    userName?: string;
    userProfession?: string;
    userGoal?: string;
    userBio?: string;
    ttsRate?: number;
    availableLanguages?: string[];
    primaryLanguage?: string;
    onlineTtsEnabled?: boolean;
    imageGenerationEnabled?: boolean;
    llmProvider?: string;
    groqApiKey?: string;
    hfApiKey?: string;
    showPersonalDictionary?: boolean;
    preventSleep?: boolean;
    dictionaryLimit?: number;
    libraryLimit?: number;
    keepLabelsEnglish?: boolean;
    nameLocked?: boolean;
    isExamMode?: boolean;
    quizTarget?: string;
    modeLocked?: boolean;
    isOnboarded?: boolean;
    textModels?: string[];
    groqModels?: string[];
    imageModels?: string[];
    ttsModels?: string[];
    groqTtsModels?: string[];
    sttGroqModels?: string[];
    sttGeminiModels?: string[];
}

export interface QuizState {
    questions: SavedQuestion[];
    currentIndex: number;
    selectedOptions: (number | null)[];
    showExplanations: boolean[];
    translations?: Record<number, string>;
}

export interface FlashcardSession {
    items: FlashcardItem[];
    currentIndex: number;
    title?: string;
}

export interface AudioFile {
    id: string;
    name: string;
    uri: string;
    duration?: number;
    timestamp: string | number;
}

export interface Tool {
    id: string;
    title: string;
    emoji: string;
    prompt: string;
    color?: string[] | string;
    category?: string;
    role?: string;
    type?: string;
    actionLabel?: string;
    placeholder?: string;
    Icon?: any;
    isCustom?: boolean;
}

export interface LibraryGroup {
    id: string;
    isGroup: true;
    toolId?: string;
    title: string;
    items?: ChatSession[];
    chapters?: ChatSession[];
    timestamp: string | number;
    pinned: boolean;
    hasAudio: boolean;
    image?: string;
    count?: number;
}

export type LibraryItem = ChatSession | LibraryGroup;

export interface ReaderParagraph {
    id: string;
    type: 'text' | 'table' | 'concept-card';
    text?: string;
    rows?: string[];
    title?: string;
    content?: string;
    offset: number;
    initiallyHidden?: boolean;
    toggleLabel?: string;
    chapterName?: string;
}

export interface SpeechRange {
    start: number;
    end: number;
    length?: number;
}

export interface LineWord {
    word: string;
    start: number;
    end: number;
    isBold: boolean;
    isItalic: boolean;
    isMath: boolean;
    isLink: boolean;
    linkUrl: string | null;
    isGreen: boolean;
}

export interface TextSegment {
    text: string;
    isBold: boolean;
    isItalic: boolean;
    isMath: boolean;
    isLink: boolean;
    linkUrl: string | null;
    isGreen: boolean;
}

export interface InteractiveTextProps {
    rawText: string;
    onWordPress?: (word: string) => void;
    onLinkPress?: (url: string) => boolean | void;
    style?: any;
    activeSentence?: SpeechRange | null;
    paragraphOffset?: number;
    theme: Theme;
    highlights?: Highlight[];
    isHighlightMode?: boolean;
    onHighlightPress?: (highlight: { start: number; end: number; text: string }) => void;
    tapToDefineEnabled?: boolean;
    disableSentenceHighlight?: boolean;
}

export interface StorageStats {
    free: number;
    used: number;
    audio: number;
}
