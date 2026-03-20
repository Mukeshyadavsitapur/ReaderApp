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
import { LinearGradient } from 'expo-linear-gradient';
import { 
    Mic, 
    Image as ImageIcon, 
    Paperclip
} from 'lucide-react-native';
import AppIcon from '../common/AppIcon';
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
    const isWeb = Platform.OS === 'web';

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.bg, overflow: 'hidden' }}
        >
            {/* Full-screen subtle gradient/tint */}
            <LinearGradient
                colors={[theme.bg, theme.id === 'day' ? '#f8faff' : theme.uiBg]}
                style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
            />

            {/* Aesthetic Background Blobs & Watermark */}
            <View style={[styles.blob, { top: -100, left: -100, backgroundColor: primaryColor + '10' }]} />
            <View style={[styles.blob, { bottom: 100, right: -100, backgroundColor: primaryColor + '08' }]} />
            
            <View style={styles.watermarkContainer}>
                <AppIcon size={320} style={{ opacity: theme.id === 'day' ? 0.06 : 0.08, transform: [{ rotate: '-15deg' }] }} />
            </View>
            
            <ResponsiveWrapper maxWidth={1000} style={styles.mainContent}>
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Greeting Section - Redesigned as a Premium Card */}
                    <View style={styles.greetingSection}>
                        <LinearGradient
                            colors={[theme.id === 'day' ? '#ffffff' : theme.uiBg, theme.id === 'day' ? '#fdfdff' : theme.uiBg]}
                            style={[styles.greetingCard, { borderColor: theme.border }]}
                        >
                            <View style={styles.greetingContainer}>
                                <View style={[styles.greetingLine, { backgroundColor: primaryColor }]} />
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' }}>
                                        <Text style={[styles.greetingText, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>
                                            Hello, {' '}
                                            <Text style={{ color: primaryColor, fontWeight: '900' }}>
                                                {userName || 'there'}
                                            </Text>
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={cycleGlobalLanguage} activeOpacity={0.7} style={{ marginTop: 8 }}>
                                        <Text style={[styles.subtitle, { color: theme.secondary, textAlign: 'left', lineHeight: 24 }]}>
                                            How can I help you learn <Text style={{ color: primaryColor, fontWeight: 'bold' }}>{displayLanguage}</Text> today?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={[styles.sparkleContainer, { backgroundColor: theme.highlight }]}>
                                <AppIcon size={18} />
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Suggestion Chips / Tool Grid */}
                    <View style={styles.gridContainer}>
                        {allTools.slice(0, 4).map((tool) => (
                            <TouchableOpacity
                                key={tool.id}
                                onPress={() => onToolPress(tool)}
                                style={[
                                    styles.toolCard, 
                                    { backgroundColor: theme.id === 'day' ? '#ffffff' : theme.uiBg, borderColor: theme.border }
                                ]}
                            >
                                <View style={[styles.toolIconContainer, { backgroundColor: theme.highlight }]}>
                                    <Text style={{ fontSize: 24 }}>{tool.emoji}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={[styles.toolTitle, { color: theme.text }]} numberOfLines={2}>
                                        {tool.title}
                                    </Text>
                                </View>
                                <View style={styles.toolArrow}>
                                    <AppIcon size={14} style={{ opacity: 0.4 }} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Pinned Search Bar */}
                <View style={[styles.pinnedContainer, { backgroundColor: theme.bg }]}>
                    {renderHomeSearchBar ? renderHomeSearchBar() : (
                        <View style={[styles.searchBarPill, { backgroundColor: theme.id === 'day' ? '#ffffff' : theme.uiBg, borderColor: theme.border }]}>
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
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        zIndex: 1,
    },
    watermarkContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    mainContent: {
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingBottom: 120,
    },
    greetingSection: {
        marginTop: Platform.OS === 'web' ? 60 : 30,
        marginBottom: 30,
    },
    greetingCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    sparkleContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    greetingLine: {
        width: 4,
        height: '100%',
        borderRadius: 2,
    },
    greetingText: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: -0.2,
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
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    toolIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolTitle: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        marginTop: 10,
    },
    toolArrow: {
        position: 'absolute',
        bottom: 12,
        right: 12,
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
