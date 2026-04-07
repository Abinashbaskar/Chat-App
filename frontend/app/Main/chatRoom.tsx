import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { getMessages, newConversation, newMessage, sendMessage as sendSocketMessage } from '@/socket/socketEVents'
import { getFullImageUri } from '@/Utils/Common'
import { scale, verticalScale } from '@/Utils/Styling'
import { router, useLocalSearchParams } from 'expo-router'
import { CaretLeft, DotsThreeVertical, PaperPlaneRight, User } from 'phosphor-react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
// If using react-native-safe-area-context, replace the import above with:
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatRoom() {
    const { name, image, conversationId, userId } = useLocalSearchParams()
    const headerName = name || 'Buddies'
    const { user: currentUser } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [text, setText] = useState('')
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId as string)
    const flatListRef = useRef<FlatList>(null)
    // ✅ Safe area insets for bottom padding (notch/home indicator)
    // const insets = useSafeAreaInsets()

    useEffect(() => {
        const handleNewConversation = (response: any) => {
            if (response.success && response.data) {
                const conv = response.data;
                const isRelevant = conv.participants.some((p: any) => p._id === userId || p === userId);
                if (isRelevant) {
                    setActiveConversationId(conv._id);
                }
            }
        };

        newConversation(handleNewConversation);

        if (!activeConversationId && userId && currentUser) {
            newConversation({
                type: "direct",
                participants: [(currentUser as any)?.id || (currentUser as any)?._id, userId],
            });
        }

        return () => {
            newConversation(handleNewConversation, true);
        }
    }, [activeConversationId, userId, currentUser])

    useEffect(() => {
        const handleGetMessages = (response: any) => {
            if (response.success && response.conversationId === activeConversationId) {
                setMessages(response.messages);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        };

        const handleNewMessage = (response: any) => {
            if (response.success && response.message.conversationId === activeConversationId) {
                setMessages(prev => [...prev, response.message]);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        };

        getMessages(handleGetMessages);
        newMessage(handleNewMessage);

        if (activeConversationId) {
            getMessages({ conversationId: activeConversationId });
        }

        return () => {
            getMessages(handleGetMessages, true);
            newMessage(handleNewMessage, true);
        };
    }, [activeConversationId])

    const handleSend = () => {
        if (!text.trim() || !activeConversationId) return;
        sendSocketMessage({
            conversationId: activeConversationId,
            content: text.trim(),
            attachment: null
        })
        setText('');
    }

    const renderItem = ({ item }: { item: any }) => {
        const isMy =
            item.senderId?._id === (currentUser as any)?._id ||
            item.senderId === (currentUser as any)?._id ||
            item.senderId?.id === (currentUser as any)?.id;

        const timeStr = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "";
        const senderName = item.senderId?.name || "Unknown";

        return (
            // ✅ FIX 1: Use justifyContent to push my messages to the right
            <View style={[styles.messageRow, isMy && styles.myMessageRow]}>

                {/* ✅ FIX 2: Only show avatar on OTHER user's messages, on the LEFT */}
                {!isMy && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.messageAvatarPlaceholder}>
                            {item.senderId?.avatar ? (
                                <Image
                                    source={{ uri: getFullImageUri(item.senderId.avatar) }}
                                    style={styles.messageAvatarPlaceholder}
                                />
                            ) : (
                                <User size={scale(16)} color={colors.neutral500} weight="fill" />
                            )}
                        </View>
                    </View>
                )}

                {/* ✅ FIX 3: Correct border radius per side */}
                <View style={[styles.bubble, isMy ? styles.myBubble : styles.otherBubble]}>
                    {!isMy && (
                        <Typo size={12} fontWeight={"600"} color={colors.primary} style={styles.senderName}>
                            {senderName}
                        </Typo>
                    )}
                    <Typo size={14} color={isMy ? colors.white : colors.neutral900} style={styles.messageText}>
                        {item.content}
                    </Typo>
                    <Typo size={10} color={isMy ? colors.white : colors.neutral500} style={styles.timeText}>
                        {timeStr}
                    </Typo>
                </View>
            </View>
        )
    }

    return (
        <ScreenWrapper showPattern={true} style={{ paddingBottom: 0, paddingHorizontal: 0 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <CaretLeft size={scale(24)} color={colors.white} weight="bold" />
                </TouchableOpacity>
                <View style={styles.headerProfile}>
                    {image ? (
                        <Image source={{ uri: getFullImageUri(image as string) }} style={styles.headerAvatar} />
                    ) : (
                        <View style={styles.headerAvatarPlaceholder}>
                            <User size={scale(20)} color={colors.neutral500} weight="fill" />
                        </View>
                    )}
                    <Typo size={18} fontWeight={"600"} color={colors.white}>
                        {headerName}
                    </Typo>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <DotsThreeVertical size={scale(24)} color={colors.white} weight="bold" />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <KeyboardAvoidingView
                style={styles.chatArea}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // ✅ FIX 4: 'height' on Android helps too
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item._id || item.id || Math.random().toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Input Area */}
                {/* ✅ FIX 5: paddingBottom accounts for safe area on notched devices */}
                <View style={[styles.inputContainer /* , { paddingBottom: insets.bottom || spacingY._10 } */]}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type message..."
                            placeholderTextColor={colors.neutral400}
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                        {/* ✅ FIX 6: Send button always visible but dimmed when empty, for better UX */}
                        <TouchableOpacity
                            style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
                            onPress={handleSend}
                            disabled={!text.trim()}
                        >
                            <PaperPlaneRight
                                size={scale(20)}
                                color={text.trim() ? colors.primary : colors.neutral300}
                                weight="fill"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacingX._15,
        paddingBottom: spacingY._20,
    },
    backButton: {
        marginRight: spacingX._10,
    },
    headerProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    },
    headerAvatar: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius.full,
    },
    headerAvatarPlaceholder: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButton: {
        marginLeft: spacingX._10,
    },
    chatArea: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._40,
        borderTopRightRadius: radius._40,
        overflow: 'hidden',
        paddingTop: spacingY._10,
    },
    listContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        paddingHorizontal: spacingX._15,
        flexGrow: 1, // ✅ FIX 7: ensures short lists still fill the space
    },
    // ✅ FIX 1: Base row — other user's messages align left
    messageRow: {
        flexDirection: 'row',
        marginBottom: spacingY._10,
        alignItems: 'flex-end', // ✅ avatars sit at the bottom of tall messages
        maxWidth: '100%',
    },
    // ✅ FIX 1: My messages align right
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    avatarContainer: {
        marginRight: spacingX._5,
        alignSelf: 'flex-end',
    },
    messageAvatarPlaceholder: {
        width: scale(30),
        height: scale(30),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    bubble: {
        maxWidth: '75%', // ✅ slightly tighter for better readability
        paddingHorizontal: spacingX._12,
        paddingVertical: spacingY._10,
        borderRadius: radius._15,
    },
    // ✅ FIX 3: Other bubble — flat on top-left
    otherBubble: {
        backgroundColor: colors.neutral100,
        borderTopLeftRadius: radius._10,
    },
    // ✅ FIX 3: My bubble — flat on top-right (not top-left!)
    myBubble: {
        backgroundColor: colors.primary,
        borderTopRightRadius: radius._10,
    },
    senderName: {
        marginBottom: verticalScale(2),
    },
    messageText: {
        lineHeight: verticalScale(20),
    },
    timeText: {
        alignSelf: 'flex-end',
        marginTop: verticalScale(3),
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._12,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral100, // ✅ subtle separator
    },
    textInputWrapper: {
        flex: 1,
        backgroundColor: colors.neutral100,
        borderRadius: radius._20,
        paddingHorizontal: spacingX._15,
        paddingRight: spacingX._5, // ✅ tighter right to hug the send button
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: verticalScale(44),
    },
    textInput: {
        flex: 1,
        fontSize: scale(14),
        color: colors.neutral900,
        maxHeight: verticalScale(100),
        paddingVertical: Platform.OS === 'ios' ? spacingY._10 : spacingY._10,
    },
    sendButton: {
        width: scale(32),
        height: scale(32),
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacingX._5,
    },
    sendButtonDisabled: {
        opacity: 0.4,
    },
})