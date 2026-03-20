// e:\ReaderAppGit\components\redesign\GeminiHome.tsx
import React from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import { 
    Mic, 
    Image as ImageIcon, 
    Paperclip, 
    Sparkles 
} from 'lucide-react-native';
import ResponsiveWrapper from '../common/ResponsiveWrapper';
import { Theme, Tool } from '../../constants/types';

interface GeminiHomeProps {
    theme: Theme;
    primaryColor: string;
    userName: string;
    displayLanguage: string;
    allTools: Tool[];
    onToolPress: (tool: Tool) => void;
    onSearch: (text: string) => void;
    onVoicePress: () => void;
    onAttachPress: () => void;
    onVisionPress: () => void;
    cycleGlobalLanguage: () => void;
    renderHomeSearchBar: () => React.ReactNode; // Optional: if we want to reuse the parent's search bar exactly
}

const GeminiHome: React.FC<GeminiHomeProps> = ({
    theme,
    primaryColor,
    userName,
    displayLanguage,
    allTools,
    onToolPress,
    onSearch,
    onVoicePress,
    onAttachPress,
    onVisionPress,
    cycleGlobalLanguage,
    renderHomeSearchBar
}) => {
    const greeting = `Hello, ${userName || 'there'}`;
    const isWeb = Platform.OS === 'web';

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.bg }}
        >
            <ResponsiveWrapper maxWidth={1000}>
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Greeting Section */}
                    <View style={styles.greetingSection}>
                        <Text style={[styles.greetingText, { color: theme.text }]}>
                            {greeting}
                        </Text>
                        <TouchableOpacity onPress={cycleGlobalLanguage}>
                            <Text style={[styles.subtitle, { color: theme.secondary }]}>
                                How can I help you learn <Text style={{ color: primaryColor, fontWeight: 'bold' }}>{displayLanguage}</Text> today?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Suggestion Chips / Tool Grid */}
                    <View style={styles.gridContainer}>
                        {allTools.slice(0, 4).map((tool) => (
                            <TouchableOpacity
                                key={tool.id}
                                onPress={() => onToolPress(tool)}
                                style={[
                                    styles.toolCard, 
                                    { backgroundColor: theme.uiBg, borderColor: theme.border }
                                ]}
                            >
                                <View style={styles.toolIconContainer}>
                                    <Text style={{ fontSize: 24 }}>{tool.emoji}</Text>
                                </View>
                                <Text style={[styles.toolTitle, { color: theme.text }]} numberOfLines={2}>
                                    {tool.title}
                                </Text>
                                <Sparkles size={16} color={primaryColor} style={styles.sparkleIcon} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Pinned Search Bar */}
                <View style={[styles.pinnedContainer, { backgroundColor: theme.bg }]}>
                    {renderHomeSearchBar ? renderHomeSearchBar() : (
                        <View style={[styles.searchBarPill, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                            <View style={styles.leftIcons}>
                                <TouchableOpacity onPress={onAttachPress} style={styles.iconBtn}>
                                    <Paperclip size={20} color={theme.secondary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onVisionPress} style={styles.iconBtn}>
                                    <ImageIcon size={20} color={theme.secondary} />
                                </TouchableOpacity>
                            </View>
                            
                            <TextInput 
                                placeholder="Type, talk or share..."
                                placeholderTextColor={theme.secondary}
                                style={[styles.searchInput, { color: theme.text }]}
                                onSubmitEditing={(e) => onSearch(e.nativeEvent.text)}
                            />

                            <View style={styles.rightIcons}>
                                <TouchableOpacity onPress={onVoicePress} style={[styles.voiceBtn, { backgroundColor: primaryColor }]}>
                                    <Mic size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ResponsiveWrapper>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingBottom: 120,
    },
    greetingSection: {
        marginTop: Platform.OS === 'web' ? 60 : 40,
        marginBottom: 40,
    },
    greetingText: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 24,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    toolCard: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    toolIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolTitle: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
    sparkleIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        opacity: 0.6,
    },
    pinnedContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        paddingTop: 10,
    },
    searchBarPill: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    leftIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    voiceBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    }
});

export default GeminiHome;
