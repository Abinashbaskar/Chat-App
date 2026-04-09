import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import UserItem from '@/components/UserItem'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { getSocket } from '@/socket/socket'
import { emitNewConversation, getContacts, offNewConversation, onNewConversation } from '@/socket/socketEVents'
import { useRouter } from 'expo-router'
import { CaretLeft } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'

const selectUser = () => {
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<any[]>([])
    const [isGroupMode, setIsGroupMode] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])

    useEffect(() => {
        const handleContacts = (response: any) => {
            console.log("Contacts fetched: ", response);
            if (response.success) {
                const mappedUsers = response.contacts.map((c: any) => ({
                    id: c._id,
                    name: c.name,
                    image: c.avatar
                }));
                setUsers(mappedUsers);
            }
        };

        // ✅ Register listener FIRST, then emit to request contacts
        getContacts(handleContacts);        // registers the "on" listener
        getContacts({});                    // emits to trigger server response (empty payload is fine)
        onNewConversation(processsNewConversation);

        return () => {
            getContacts(handleContacts, true);  // ✅ cleanup listener
            offNewConversation(processsNewConversation);
        };
    }, [currentUser]);

    const processsNewConversation = (response: any) => {
        console.log("New conversation: ", response);
        if (response.success && response.data) {
            const conversation = response.data;
            let name = conversation.name;
            let image = conversation.avatar;
            let otherUserId = "";

            if (conversation.type === "direct") {
                const currentUserId = currentUser?.id || (currentUser as any)?._id || (currentUser as any)?.userId;
                const otherParticipant = conversation.participants.find((p: any) =>
                    (p._id || p.id) !== currentUserId
                );

                if (otherParticipant) {
                    name = otherParticipant.name;
                    image = otherParticipant.avatar;
                    otherUserId = otherParticipant._id || otherParticipant.id;
                }
            }

            router.replace({
                pathname: '/Main/chatRoom',
                params: {
                    conversationId: conversation._id,
                    name: name,
                    image: image,
                    userId: otherUserId
                }
            })
        }
    }

    const toggleParticipant = (user: any) => {
        // Just a placeholder until group mode is fully built
        if (selectedUsers.includes(user)) {
            setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers(prev => [...prev, user]);
        }
    }

    const onSelectUser = (user: any) => {
        if (!currentUser) {
            Alert.alert("Authentication", "Please login to start a conversation");
            return;
        }

        const senderId = (currentUser as any)?._id || (currentUser as any)?.id;
        const receiverId = user?.id;

        console.log("Sending participants:", senderId, receiverId);

        // ✅ Add this debug
        const socket = getSocket();
        console.log("Socket ID:", socket?.id);
        console.log("Socket connected:", socket?.connected);

        emitNewConversation({
            type: "direct",
            participants: [senderId, receiverId],
        });
    };

    return (
        <ScreenWrapper showPattern={false} isModal={true} barStyle="dark-content" style={{ paddingHorizontal: 0 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <CaretLeft size={24} color={colors.neutral900} weight="bold" />
                </TouchableOpacity>
                <Typo size={18} fontWeight="700" color={colors.neutral900}>
                    Select User
                </Typo>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            onPress={() => onSelectUser(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </ScreenWrapper>
    )
}

export default selectUser

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
        backgroundColor: colors.white,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacingY._10 : spacingY._10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: spacingY._10,
    },
    listContent: {
        paddingBottom: spacingY._50,
    }
})
