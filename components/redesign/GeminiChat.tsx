// e:\ReaderAppGit\components\redesign\GeminiChat.tsx
import React from 'react';
import { 
    View, 
    Text, 
    FlatList,
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { 
    Mic, 
    ArrowRight, 
    X, 
    Volume2,
    Square,
    Lightbulb,
    CheckCircle,
    PhoneOff,
    Keyboard as KeyboardIcon
} from 'lucide-react-native';
import AppIcon from '../common/AppIcon';
import ResponsiveWrapper from '../common/ResponsiveWrapper';
import InteractiveText from '../common/InteractiveText';
import { Theme, Message, Tool, SpeechRange } from '../../constants/types';

interface GeminiChatProps {
    theme: Theme;
    primaryColor: string;
    messages: Message[];
    activeChar: Tool | null;
    isTyping: boolean;
    input: string;
    setInput: (text: string) => void;
    onSend: (text: string) => void;
    onVoiceToggle: () => void;
    onEndSession: () => void;
    onWordLookup: (word: string) => void;
    onBrainstorm: (msg: Message) => void;
    onGrammarCheck: (msg: Message) => void;
    onTTS: (text: string, msgId: string) => void;
    onSwitchLanguage: (msg: Message) => void;
    isRecording: boolean;
    speakingMsgId: string | null;
    translatingMsgId: string | null;
    brainstormingMsgId: string | null;
    grammarCheckingMsgId: string | null;
    brainstormHints: Record<string, string>;
    grammarHints: Record<string, string>;
    speechRange: SpeechRange | null;
    msgLanguages: Record<string, string>;
    displayLanguage: string;
    scrollRef: React.RefObject<FlatList | null>;
}

const GeminiChat: React.FC<GeminiChatProps> = ({
    theme,
    primaryColor,
    messages,
    activeChar,
    isTyping,
    input,
    setInput,
    onSend,
    onVoiceToggle,
    onEndSession,
    onWordLookup,
    onBrainstorm,
    onGrammarCheck,
    onTTS,
    onSwitchLanguage,
    isRecording,
    speakingMsgId,
    translatingMsgId,
    brainstormingMsgId,
    grammarCheckingMsgId,
    brainstormHints,
    grammarHints,
    speechRange,
    msgLanguages,
    displayLanguage,
    scrollRef
}) => {

    const [isKeyboardMode, setIsKeyboardMode] = React.useState(false);
    const [shouldFollow, setShouldFollow] = React.useState(true);
    const lastMsgCount = React.useRef(messages.length);

    // Auto-scroll logic: Follow TTS or Scroll to New Message
    React.useEffect(() => {
        if (!scrollRef.current) return;

        // 1. New message added: Always scroll to end if it's from user, or follow if enabled
        if (messages.length > lastMsgCount.current) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'user') {
                setShouldFollow(true);
                scrollRef.current.scrollToEnd({ animated: true });
            } else if (shouldFollow) {
                // For AI messages, we start following
                scrollRef.current.scrollToEnd({ animated: true });
            }
            lastMsgCount.current = messages.length;
            return;
        }

        // 2. TTS Follow Logic
        if (speakingMsgId && speechRange && shouldFollow) {
            const msgIdx = messages.findIndex(m => m.id === speakingMsgId);
            if (msgIdx !== -1) {
                const msg = messages[msgIdx];
                const progress = speechRange.start / (msg.content.length || 1);
                
                // Keep the spoken part in the upper third of the screen (viewPosition 0 to 0.3)
                // We use a small threshold to avoid jittery small scrolls
                if (progress > 0.1) {
                    scrollRef.current.scrollToIndex({
                        index: msgIdx,
                        viewPosition: Math.min(progress, 0.4), // Don't push it too far up
                        animated: true,
                    });
                }
            }
        }
    }, [messages.length, speechRange, speakingMsgId, shouldFollow]);

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
        
        // If user scrolls to bottom, re-enable following
        if (isAtBottom && !shouldFollow) {
            setShouldFollow(true);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.bg }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
            <ResponsiveWrapper maxWidth={900}>
                <FlatList 
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    onScroll={handleScroll}
                    onScrollBeginDrag={() => setShouldFollow(false)}
                    renderItem={({ item: msg }) => {
                        const isUser = msg.role === 'user';
                        const isAssistant = msg.role === 'assistant';
                        
                        return (
                            <View style={[
                                styles.messageContainer,
                                isUser ? styles.userContainer : styles.assistantContainer
                            ]}>
                                <View style={[
                                    styles.bubble,
                                    isUser 
                                        ? { backgroundColor: primaryColor, borderBottomRightRadius: 4 } 
                                        : { backgroundColor: theme.bubbleAI, borderBottomLeftRadius: 4 }
                                ]}>
                                    <InteractiveText 
                                        rawText={msg.content}
                                        theme={theme}
                                        activeSentence={speakingMsgId === msg.id ? speechRange : null}
                                        disableSentenceHighlight={true}
                                        onWordPress={onWordLookup}
                                        style={{ color: isUser ? '#fff' : theme.text, fontSize: 16, lineHeight: 24 }}
                                    />
                                    
                                    {/* Action row for Assistant */}
                                    {isAssistant && (
                                        <View>
                                            <View style={styles.actionRow}>
                                                <Text style={[styles.hintTextSmall, { color: theme.secondary }]}>tap any word to define</Text>
                                                
                                                <View style={styles.rightActions}>
                                                    <TouchableOpacity onPress={() => onTTS(msg.content, msg.id)}>
                                                        {speakingMsgId === msg.id ? <Square size={16} color="#ef4444" fill="#ef4444" /> : <Volume2 size={16} color={theme.secondary} />}
                                                    </TouchableOpacity>
                                                    
                                                    <TouchableOpacity onPress={() => onSwitchLanguage(msg)} style={styles.langBadge}>
                                                        {translatingMsgId === msg.id ? (
                                                            <ActivityIndicator size="small" color={theme.secondary} />
                                                        ) : (
                                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.secondary }}>
                                                                {(msgLanguages[msg.id] || displayLanguage || 'EN').substring(0,2).toUpperCase()}
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => onBrainstorm(msg)}>
                                                        {brainstormingMsgId === msg.id ? <ActivityIndicator size="small" color="#f59e0b" /> : <Lightbulb size={16} color={brainstormHints[msg.id] ? "#f59e0b" : theme.secondary} />}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {brainstormHints[msg.id] && (
                                                <View style={[styles.hintBubble, { backgroundColor: theme.uiBg + '80', borderColor: '#f59e0b30' }]}>
                                                    <Lightbulb size={12} color="#f59e0b" style={{ marginRight: 6, marginTop: 2 }} />
                                                    <Text style={[styles.hintText, { color: theme.text }]}>{brainstormHints[msg.id]}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    {/* Grammar Check for User */}
                                    {isUser && (
                                        <View>
                                            <TouchableOpacity onPress={() => onGrammarCheck(msg)} style={styles.grammarBtn}>
                                                <CheckCircle size={14} color="rgba(255,255,255,0.7)" />
                                                <Text style={styles.grammarText}>check</Text>
                                            </TouchableOpacity>

                                            {grammarHints[msg.id] && (
                                                <View style={[styles.correctionBubble, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                                    <CheckCircle size={12} color="#fff" style={{ marginRight: 6, marginTop: 2 }} />
                                                    <Text style={styles.correctionText}>{grammarHints[msg.id]}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                    ListFooterComponent={isTyping ? (
                        <View style={styles.typingContainer}>
                            <View style={[styles.avatar, { backgroundColor: theme.uiBg }]}>
                                <AppIcon size={20} />
                            </View>
                            <View style={[styles.bubble, { backgroundColor: theme.bubbleAI, borderBottomLeftRadius: 4, marginLeft: 12, paddingVertical: 10, paddingHorizontal: 16 }]}>
                                <ActivityIndicator size="small" color={primaryColor} />
                            </View>
                        </View>
                    ) : null}
                />

                {/* Bottom Control Area */}
                <View style={[styles.inputContainer, { backgroundColor: theme.bg }]}>
                    {!isKeyboardMode ? (
                        <View style={styles.voiceControlWrapper}>
                            <TouchableOpacity 
                                onPress={() => setIsKeyboardMode(true)} 
                                style={[styles.keyboardBtn, { borderColor: theme.border, borderWidth: 1 }]}
                            >
                                <KeyboardIcon size={24} color={theme.secondary} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={onVoiceToggle} 
                                style={[
                                    styles.micRectangleBtn, 
                                    { 
                                        backgroundColor: 'transparent',
                                        borderColor: isRecording ? '#ef4444' : theme.border,
                                        borderWidth: 1
                                    }
                                ]}
                                activeOpacity={0.7}
                            >
                                <Mic size={28} color={isRecording ? "#ef4444" : primaryColor} fill={isRecording ? "rgba(239, 68, 68, 0.1)" : "transparent"} />
                                {isRecording && <ActivityIndicator size="small" color="#ef4444" style={{ marginLeft: 10 }} />}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={onEndSession} 
                                style={[styles.cutCallBtn, { borderColor: theme.border, borderWidth: 1 }]}
                            >
                                <PhoneOff size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.inputPill, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                            <TextInput 
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Message Assistant..."
                                placeholderTextColor={theme.secondary}
                                value={input}
                                onChangeText={setInput}
                                multiline
                                autoFocus
                                onSubmitEditing={() => onSend(input)}
                            />
                            <View style={styles.inputActions}>
                                <TouchableOpacity 
                                    onPress={() => {
                                        onVoiceToggle();
                                        setIsKeyboardMode(false);
                                    }} 
                                    style={[styles.micBtn, isRecording && { backgroundColor: '#ef4444' }]}
                                >
                                    <Mic size={20} color={isRecording ? '#fff' : theme.secondary} fill={isRecording ? "#fff" : "transparent"} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onSend(input)} style={[styles.sendBtn, { backgroundColor: primaryColor }]}>
                                    <ArrowRight size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    
                    {isKeyboardMode && (
                        <TouchableOpacity onPress={onEndSession} style={styles.endBtn}>
                            <X size={20} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </ResponsiveWrapper>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    assistantContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    bubble: {
        maxWidth: '85%',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    userBubble: {
        paddingHorizontal: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        opacity: 0.8,
        width: '100%',
    },
    hintTextSmall: {
        fontSize: 11,
        fontStyle: 'italic',
        opacity: 0.7,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    langBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    grammarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    grammarText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        fontStyle: 'italic',
    },
    hintBubble: {
        flexDirection: 'row',
        marginTop: 12,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    hintText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    correctionBubble: {
        flexDirection: 'row',
        marginTop: 12,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    correctionText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: '#fff',
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        gap: 12,
    },
    inputPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderRadius: 28,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingTop: 8,
        paddingBottom: 8,
        maxHeight: 150,
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    micBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    voiceControlWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    cutCallBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    micRectangleBtn: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyboardBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default GeminiChat;
