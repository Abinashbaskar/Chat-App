import { View, StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { CaretLeft, DotsThreeVertical, User, PaperPlaneRight } from 'phosphor-react-native'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/Utils/Styling'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { getFullImageUri } from '@/Utils/Common'
import { useAuth } from '@/context/authContext'
import { getMessages, sendMessage as sendSocketMessage, newMessage, newConversation } from '@/socket/socketEVents'

export default function ChatRoom() {
    const { name, image, conversationId, userId } = useLocalSearchParams()
    const headerName = name || 'Buddies'
    const { user: currentUser } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [text, setText] = useState('')
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId as string)
    const flatListRef = useRef<FlatList>(null)

    useEffect(() => {
        const handleNewConversation = (response: any) => {
            if (response.success && response.data) {
                const conv = response.data;
                const myId = (currentUser as any)?.id || (currentUser as any)?._id;
                // Verify the created/fetched conversation involves the user we clicked on
                const isRelevant = conv.participants.some((p: any) => p._id === userId || p === userId);
                if (isRelevant) {
                    setActiveConversationId(conv._id);
                }
            }
        };

        newConversation(handleNewConversation);
        
        // If we don't have a conversation ID yet (e.g. fresh navigation from selectUser)
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
        const isMy = item.senderId?._id === (currentUser as any)?._id || item.senderId === (currentUser as any)?._id || item.senderId?.id === (currentUser as any)?.id;
        const timeStr = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
        const senderName = item.senderId?.name || "Unknown";

        return (
            <View style={styles.messageRow}>
                {!isMy ? (
                    <View style={styles.avatarContainer}>
                        <View style={styles.messageAvatarPlaceholder}>
                            {item.senderId?.avatar ? (
                                <Image source={{ uri: getFullImageUri(item.senderId.avatar) }} style={styles.messageAvatarPlaceholder} />
                            ) : (
                                <User size={scale(16)} color={colors.neutral500} weight="fill" />
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.myMessageSpacer} />
                )}

                <View style={[styles.bubble, isMy ? styles.myBubble : styles.otherBubble]}>
                    {!isMy && (
                        <Typo size={12} fontWeight={"600"} color={colors.neutral800} style={styles.senderName}>
                            {senderName}
                        </Typo>
                    )}
                    <Typo size={14} color={colors.neutral900} style={styles.messageText}>
                        {item.content}
                    </Typo>
                    <Typo size={10} color={colors.neutral500} style={styles.timeText}>
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Image 
                            source={{ uri: 'https://picsum.photos/id/237/100' }} 
                            style={styles.attachPreview} 
                        />
                    </TouchableOpacity>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type message"
                            placeholderTextColor={colors.neutral400}
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                        {text.trim().length > 0 && (
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <PaperPlaneRight size={scale(20)} color={colors.primary} weight="fill" />
                            </TouchableOpacity>
                        )}
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
    },
    headerAvatar: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius.full,
        marginRight: spacingX._10,
    },
    headerAvatarPlaceholder: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacingX._10,
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
        paddingBottom: spacingY._20,
        paddingHorizontal: spacingX._15,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: spacingY._15,
        alignItems: 'flex-start',
    },
    avatarContainer: {
        marginRight: spacingX._10,
    },
    messageAvatarPlaceholder: {
        width: scale(32),
        height: scale(32),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    myMessageSpacer: {
        width: scale(32),
        marginRight: spacingX._10,
    },
    bubble: {
        maxWidth: '85%',
        paddingHorizontal: spacingX._15,
        paddingVertical: spacingY._10,
        borderRadius: radius._15,
    },
    otherBubble: {
        backgroundColor: colors.otherBubble,
        borderTopLeftRadius: radius._10,
    },
    myBubble: {
        backgroundColor: colors.myBubble,
        borderTopLeftRadius: radius._10, 
    },
    senderName: {
        marginBottom: verticalScale(4),
    },
    messageText: {
        lineHeight: verticalScale(20),
    },
    timeText: {
        alignSelf: 'flex-end',
        marginTop: verticalScale(2),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacingX._15,
        paddingVertical: spacingY._10,
        backgroundColor: colors.white,
    },
    attachButton: {
        marginRight: spacingX._10,
        marginBottom: verticalScale(2),
    },
    attachPreview: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
    },
    textInputWrapper: {
        flex: 1,
        backgroundColor: colors.neutral100,
        borderRadius: radius.full,
        paddingHorizontal: spacingX._15,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: verticalScale(40),
    },
    textInput: {
        flex: 1,
        fontSize: scale(14),
        color: colors.neutral900,
        maxHeight: verticalScale(100),
        paddingTop: Platform.OS === 'ios' ? spacingY._10 : spacingY._10,
        paddingBottom: Platform.OS === 'ios' ? spacingY._10 : spacingY._10,
    },
    sendButton: {
        padding: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
    }
})
