import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import UserItem from '@/components/UserItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { CaretLeft } from 'phosphor-react-native'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

const selectUser = () => {
    const router = useRouter()
    const [users, setUsers] = useState([
        { id: 1, name: "Liam Carter", image: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Emma Davis", image: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Noah Wilson", image: "https://i.pravatar.cc/150?u=3" },
        { id: 4, name: "Olivia Moore", image: "https://i.pravatar.cc/150?u=4" },
        { id: 5, name: "James Anderson", image: "https://i.pravatar.cc/150?u=5" },
        { id: 6, name: "Ava Thomas", image: "https://i.pravatar.cc/150?u=6" },
        { id: 7, name: "Ethan Miller", image: "https://i.pravatar.cc/150?u=7" },
        { id: 8, name: "Sophia Taylor", image: "https://i.pravatar.cc/150?u=8" },
        { id: 9, name: "Benjamin Harris", image: "https://i.pravatar.cc/150?u=9" },
        { id: 10, name: "Mia Clark", image: "https://i.pravatar.cc/150?u=10" },
    ])

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
                            onPress={() => {
                                // For now just go back, later this would start a chat
                                router.back()
                            }}
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
