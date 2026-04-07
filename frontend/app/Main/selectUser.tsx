import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import UserItem from '@/components/UserItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { CaretLeft } from 'phosphor-react-native'
import React, { useState, useEffect } from 'react'
import { getContacts, newConversation } from '@/socket/socketEVents'
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'react-native'
import { useAuth } from '@/context/authContext'

const selectUser = () => {
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<any[]>([])

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

        getContacts(handleContacts);
        getContacts({});

        return () => {
            getContacts(handleContacts, true);
        };
    }, [currentUser])

    const startChat = (user: any) => {
        if (!currentUser) return;
        router.push({
            pathname: '/Main/chatRoom',
            params: {
                userId: user.id,
                name: user.name || '',
                image: user.image || '',
            }
        });
    }

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
                <View style={{ width: 40 }} /> {/* Spacer to center title */}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            onPress={() => startChat(item)}
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
