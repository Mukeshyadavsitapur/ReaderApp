// e:\ReaderAppGit\components\common\InteractiveText.tsx
import React, { useMemo, useRef } from 'react';
import { Text, View, StyleSheet, Platform, Linking, Alert, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { Theme, Highlight, SpeechRange, LineWord, TextSegment, InteractiveTextProps } from '../../constants/types';
import { HIGHLIGHT_COLORS } from '../../constants/highlights';

const styles = StyleSheet.create({
    codeBlock: {
        borderRadius: 16,
        marginVertical: 16,
        padding: 0,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    codeLang: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    copyText: {
        fontSize: 11,
        fontWeight: '700',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        padding: 20,
        lineHeight: 20,
    },
});

const InteractiveText = React.memo(({ 
    rawText, 
    onWordPress, 
    onLinkPress, 
    style, 
    activeSentence, 
    paragraphOffset = 0, 
    theme, 
    isHighlightMode,
    highlights = [], 
    onHighlightPress,
    tapToDefineEnabled = true 
}: InteractiveTextProps) => {
    const flatStyle: any = useMemo(() => StyleSheet.flatten(style) || {}, [style]);

    const { lines: processedLines, totalLength } = useMemo(() => {
        if (typeof rawText !== 'string') return { lines: [], totalLength: 0 };
        
        // Pre-process for Code Blocks
        const lines = rawText.split(/(\n)/g);
        let charIndex = 0;
        let inCodeBlock = false;
        let currentCode = "";
        let codeLang = "";

        const resultLines: any[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === '\n') {
                if (!inCodeBlock) resultLines.push({ isNewline: true, key: i });
                else currentCode += '\n';
                continue;
            }

            const trimmed = line.trim();
            if (trimmed.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeLang = trimmed.slice(3).trim();
                    currentCode = "";
                } else {
                    inCodeBlock = false;
                    resultLines.push({ type: 'code', content: currentCode.trim(), lang: codeLang, key: i });
                }
                continue;
            }

            if (inCodeBlock) {
                currentCode += line;
                continue;
            }

            // Normal line processing (Headers, Lists, Formulas, etc.)
            let type = 'normal';
            let cleanLine = line;

            if (trimmed.length === 0) {
                resultLines.push({ isNewline: false, isEmpty: true, key: i });
                continue;
            }

            if (trimmed.startsWith('#')) {
                type = 'header';
                cleanLine = line.replace(/#{1,6}\s*/, '');
            } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50) {
                type = 'menu';
                cleanLine = line.replace(/^\*\*/, '').replace(/\*\*$/, '');
            } else if ((trimmed.startsWith('* ') || trimmed.startsWith('- ')) && trimmed.length < 60) {
                type = 'submenu';
                cleanLine = line.replace(/^[\*\-]\s*/, '');
            } else if (trimmed.startsWith('>')) {
                type = 'quote';
                cleanLine = line.replace(/^>\s*/, '');
            } else {
                // Formula Detection (stripped of $$ as per user rule)
                const isFormula = (trimmed.startsWith('$$') && trimmed.endsWith('$$')) || (trimmed.startsWith('$') && trimmed.endsWith('$'));
                if (isFormula) {
                    type = 'formula';
                    cleanLine = trimmed.replace(/^\$\$?|\$\$?$/g, '');
                } else {
                    const mathSymbols = /[=≈∝><≥≤∫∑√±×÷]/;
                    if (trimmed.length < 80 && mathSymbols.test(trimmed) && !trimmed.endsWith('.')) {
                        type = 'formula';
                        cleanLine = trimmed;
                    }
                }
            }

            // Segmentation logic for Bold, Italic, Links, Math
            let mixedSegments: TextSegment[] = [{ text: cleanLine, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false }];

            // 1. Links [Text](URL)
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath) return [seg];
                const parts = seg.text.split(/(\[[^\]]+\]\([^)]+\))/g);
                return parts.map(part => {
                    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                    if (linkMatch) {
                        return { text: linkMatch[1], isBold: false, isItalic: false, isMath: false, isLink: true, linkUrl: linkMatch[2], isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 2. Bold **text**
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\*\*.*?\*\*)/g).map(part => {
                    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                        return { text: part.slice(2, -2), isBold: true, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 3. Math $text$
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\$.*?\$)/g).map(part => {
                    if (part.startsWith('$') && part.endsWith('$') && part.length >= 3) {
                        return { text: part.slice(1, -1), isBold: false, isItalic: false, isMath: true, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 4. Italic *text*
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\*[^*]+?\*)/g).map(part => {
                    if (part.startsWith('*') && part.endsWith('*') && part.length >= 3) {
                        return { text: part.slice(1, -1), isBold: false, isItalic: true, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            const lineWords: LineWord[] = [];
            mixedSegments.forEach(seg => {
                let cleanSeg = seg.text;
                if (!seg.isMath && !seg.isLink && !seg.isGreen) {
                    cleanSeg = cleanSeg.replace(/(\*\*|__|\*|_|`|~|\\|\[|\]|#)/g, '');
                    cleanSeg = cleanSeg.replace(/\s+/g, ' ');
                }
                const words = cleanSeg.split(/(\s+)/);
                words.forEach(word => {
                    if (!word) return;
                    lineWords.push({
                        word,
                        start: charIndex,
                        end: charIndex + word.length,
                        isBold: seg.isBold,
                        isItalic: seg.isItalic,
                        isMath: seg.isMath,
                        isLink: seg.isLink,
                        linkUrl: seg.linkUrl,
                        isGreen: seg.isGreen
                    });
                    charIndex += word.length;
                });
            });

            resultLines.push({ lineWords, type, key: i });
        }

        return { lines: resultLines, totalLength: charIndex };
    }, [rawText]);

    const pressTrackerRef = useRef({ time: 0, x: 0, y: 0 });
    const [copiedId, setCopiedId] = React.useState<number | null>(null);

    const handleCopy = (code: string, id: number) => {
        Clipboard.setString(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <View style={{ width: '100%' }}>
            {processedLines.map((lineData) => {
                if (lineData.isNewline) return <Text key={lineData.key}>{"\n"}</Text>;
                if (lineData.isEmpty) return null;

                if (lineData.type === 'code') {
                    return (
                        <View key={lineData.key} style={[styles.codeBlock, { backgroundColor: theme.id === 'day' ? '#f3f4f6' : '#1f2937' }]}>
                            <View style={styles.codeHeader}>
                                <Text style={styles.codeLang}>{lineData.lang || 'code'}</Text>
                                <TouchableOpacity onPress={() => handleCopy(lineData.content, lineData.key)} style={styles.copyBtn}>
                                    {copiedId === lineData.key ? <Check size={14} color="#10b981" /> : <Copy size={14} color={theme.secondary} />}
                                    <Text style={[styles.copyText, { color: copiedId === lineData.key ? "#10b981" : theme.secondary }]}>
                                        {copiedId === lineData.key ? 'Copied' : 'Copy'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <Text style={[styles.codeText, { color: theme.text }]}>{lineData.content}</Text>
                            </ScrollView>
                        </View>
                    );
                }

                const { lineWords, type, key } = lineData;
                let dynamicColor = flatStyle.color || theme.text;
                let dynamicWeight = flatStyle.fontWeight || 'normal';
                let dynamicSize = flatStyle.fontSize || 16;
                let dynamicMargin = 0;
                let dynamicStyle = flatStyle.fontStyle || 'normal';
                let dynamicTextAlign = 'left';

                if (type === 'header') {
                    dynamicColor = theme.primary;
                    dynamicWeight = 'bold';
                    dynamicSize *= 1.25;
                    dynamicMargin = 16;
                } else if (type === 'formula') {
                    dynamicTextAlign = 'center';
                    dynamicStyle = 'italic';
                    dynamicSize *= 1.15;
                    dynamicMargin = 8;
                    dynamicWeight = '600';
                } else if (type === 'quote') {
                    dynamicColor = theme.secondary;
                    dynamicStyle = 'italic';
                    dynamicMargin = 4;
                }

                return (
                    <Text key={key} style={{ marginTop: dynamicMargin, textAlign: dynamicTextAlign as any, width: '100%', lineHeight: flatStyle.lineHeight }} selectable={!isHighlightMode}>
                        {lineWords && (lineWords as any[]).map(({ word, start, end, isBold, isItalic, isMath, isLink, linkUrl, isGreen }, index) => {
                            if (!word) return null;
                            const globalStart = paragraphOffset + start;
                            const globalEnd = globalStart + word.length;

                            let backgroundColor = 'transparent';
                            if (activeSentence && globalStart >= activeSentence.start && globalStart < activeSentence.end) {
                                backgroundColor = theme.activeWord;
                            }

                            const manualHighlight = highlights.find(h => (globalStart < h.end && globalEnd > h.start));
                            if (manualHighlight) {
                                const hColor = manualHighlight.color || 'yellow';
                                const colorDef = (HIGHLIGHT_COLORS as any)[hColor] || HIGHLIGHT_COLORS.yellow;
                                backgroundColor = theme.id === 'day' ? colorDef.day : colorDef.night;
                            }

                            const isUrl = word.match(/^https?:\/\//i);
                            let wordColor = dynamicColor;
                            let wordWeight = dynamicWeight;
                            let wordStyleProp = dynamicStyle;
                            let wordDecor = 'none';

                            if (isUrl || isLink) {
                                wordColor = theme.primary;
                                wordDecor = 'underline';
                                if (isLink) wordWeight = 'bold';
                            } else if (isBold) {
                                // NEW: For Gemini style, bold text stays theme color but with primary weight
                                wordColor = dynamicColor; 
                                wordWeight = '800'; 
                            } else if (isMath) {
                                wordColor = theme.id === 'day' ? '#ea580c' : '#fb923c';
                                wordWeight = '600';
                            } else if (isGreen) {
                                wordColor = '#22c55e';
                                wordWeight = 'bold';
                            }

                            const wordStyle = {
                                color: wordColor,
                                fontWeight: wordWeight,
                                backgroundColor,
                                fontSize: dynamicSize,
                                fontStyle: wordStyleProp,
                                textDecorationLine: wordDecor as any,
                                fontFamily: type === 'formula' ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : flatStyle.fontFamily,
                            };

                            const isInteractive = isHighlightMode || (isLink && linkUrl) || isUrl || tapToDefineEnabled;

                            return (
                                <Text
                                    key={`${key}-${index}`}
                                    style={wordStyle}
                                    onPressIn={(e) => {
                                        const { pageX, pageY } = e.nativeEvent;
                                        pressTrackerRef.current = { time: Date.now(), x: pageX, y: pageY };
                                    }}
                                    onPress={isInteractive ? (e) => {
                                        const { pageX, pageY } = e.nativeEvent || {};
                                        const { time, x, y } = pressTrackerRef.current;
                                        const duration = Date.now() - time;
                                        
                                        if (Platform.OS !== 'web') {
                                            const dist = Math.sqrt(Math.pow((pageX || 0) - x, 2) + Math.pow((pageY || 0) - y, 2));
                                            if (duration > 350 || dist > 10) return;
                                        } else if (time !== 0 && duration > 500) {
                                            return;
                                        }

                                        if (isHighlightMode) {
                                            onHighlightPress && onHighlightPress({
                                                start: paragraphOffset,
                                                end: paragraphOffset + totalLength,
                                                text: "Paragraph Highlight"
                                            });
                                        } else if (isLink && linkUrl) {
                                            onLinkPress?.(linkUrl) || Linking.openURL(linkUrl).catch(() => {});
                                        } else if (isUrl) {
                                            Linking.openURL(word.replace(/[.,;)]$/, '')).catch(() => {});
                                        } else if (tapToDefineEnabled) {
                                            onWordPress?.(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"'?]/g, ""));
                                        }
                                    } : undefined}
                                >
                                    {word}
                                </Text>
                            );
                        })}
                    </Text>
                );
            })}
        </View>
    );
}, (prev, next) => {
    const prevStyle = StyleSheet.flatten(prev.style) || {};
    const nextStyle = StyleSheet.flatten(next.style) || {};

    if (prev.rawText !== next.rawText ||
        prev.paragraphOffset !== next.paragraphOffset ||
        prev.theme.id !== next.theme.id ||
        prev.isHighlightMode !== next.isHighlightMode ||
        prev.tapToDefineEnabled !== next.tapToDefineEnabled ||
        prevStyle.fontSize !== nextStyle.fontSize ||
        prevStyle.color !== nextStyle.color ||
        prevStyle.fontStyle !== nextStyle.fontStyle
    ) return false;

    // Highlights & Active Sentence optimization
    const pStart = next.paragraphOffset || 0;
    const pEnd = pStart + next.rawText.length + 50;
    
    const sentenceIntersects = (range: any) => range && range.start < pEnd && range.end > pStart;
    if (sentenceIntersects(prev.activeSentence) !== sentenceIntersects(next.activeSentence)) return false;

    if (prev.highlights !== next.highlights) {
        const getRelevant = (list: Highlight[]) => list.filter(h => h.start < pEnd && h.end > pStart);
        if (getRelevant(prev.highlights || []).length !== getRelevant(next.highlights || []).length) return false;
    }

    return true;
});


InteractiveText.displayName = 'InteractiveText';

export default InteractiveText;
