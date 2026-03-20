// e:\ReaderAppGit\components\redesign\GeminiChat.tsx
import React from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
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
    CheckCircle
} from 'lucide-react-native';
import AppIcon from '../common/AppIcon';
import ResponsiveWrapper from '../common/ResponsiveWrapper';
import InteractiveText from '../common/InteractiveText';
import { Theme, Message, Tool } from '../../constants/types';

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
    isTranscribing: boolean;
    speakingMsgId: string | null;
    translatingMsgId: string | null;
    brainstormingMsgId: string | null;
    grammarCheckingMsgId: string | null;
    brainstormHints: Record<string, string>;
    grammarHints: Record<string, string>;
    msgLanguages: Record<string, string>;
    displayLanguage: string;
    scrollRef: React.RefObject<ScrollView | null>;
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
    isTranscribing,
    speakingMsgId,
    translatingMsgId,
    brainstormingMsgId,
    grammarCheckingMsgId,
    brainstormHints,
    grammarHints,
    msgLanguages,
    displayLanguage,
    scrollRef
}) => {
    const isWeb = Platform.OS === 'web';

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.bg }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
            <ResponsiveWrapper maxWidth={900}>
                <ScrollView 
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        const isAssistant = msg.role === 'assistant';
                        
                        return (
                            <View key={msg.id} style={[
                                styles.messageContainer,
                                isUser ? styles.userContainer : styles.assistantContainer
                            ]}>
                                {!isUser && (
                                    <View style={[styles.avatar, { backgroundColor: theme.uiBg }]}>
                                        <AppIcon size={20} />
                                    </View>
                                )}
                                
                                <View style={[
                                    styles.bubble,
                                    isUser ? { backgroundColor: primaryColor, borderBottomRightRadius: 4 } : { backgroundColor: 'transparent' }
                                ]}>
                                    <InteractiveText 
                                        rawText={msg.content}
                                        theme={theme}
                                        onWordPress={onWordLookup}
                                        style={{ color: isUser ? '#fff' : theme.text, fontSize: 16, lineHeight: 24 }}
                                    />
                                    
                                    {/* Action row for Assistant */}
                                    {isAssistant && (
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity onPress={() => onTTS(msg.content, msg.id)}>
                                                {speakingMsgId === msg.id ? <Square size={16} color="#ef4444" fill="#ef4444" /> : <Volume2 size={16} color={theme.secondary} />}
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity onPress={() => onSwitchLanguage(msg)} style={styles.langBadge}>
                                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.secondary }}>
                                                    {(msgLanguages[msg.id] || displayLanguage || 'EN').substring(0,2).toUpperCase()}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => onBrainstorm(msg)}>
                                                {brainstormingMsgId === msg.id ? <ActivityIndicator size="small" color="#f59e0b" /> : <Lightbulb size={16} color={brainstormHints[msg.id] ? "#f59e0b" : theme.secondary} />}
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* Grammar Check for User */}
                                    {isUser && (
                                        <TouchableOpacity onPress={() => onGrammarCheck(msg)} style={styles.grammarBtn}>
                                            <CheckCircle size={14} color="rgba(255,255,255,0.7)" />
                                            <Text style={styles.grammarText}>check</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                    
                    {isTyping && (
                        <View style={styles.typingContainer}>
                            <View style={[styles.avatar, { backgroundColor: theme.uiBg }]}>
                                <AppIcon size={20} />
                            </View>
                            <ActivityIndicator size="small" color={primaryColor} style={{ marginLeft: 12 }} />
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Input Pill */}
                <View style={[styles.inputContainer, { backgroundColor: theme.bg }]}>
                    <View style={[styles.inputPill, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                        <TextInput 
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Message Assistant..."
                            placeholderTextColor={theme.secondary}
                            value={input}
                            onChangeText={setInput}
                            multiline
                            onSubmitEditing={() => onSend(input)}
                        />
                        <View style={styles.inputActions}>
                            <TouchableOpacity onPress={onVoiceToggle} style={[styles.micBtn, isRecording && { backgroundColor: '#ef4444' }]}>
                                <Mic size={20} color={isRecording ? '#fff' : theme.secondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onSend(input)} style={[styles.sendBtn, { backgroundColor: primaryColor }]}>
                                <ArrowRight size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onEndSession} style={styles.endBtn}>
                        <X size={20} color="#ef4444" />
                    </TouchableOpacity>
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
        borderRadius: 18,
        marginLeft: 12,
    },
    userBubble: {
        paddingHorizontal: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 12,
        opacity: 0.8,
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
    }
});

export default GeminiChat;
