import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import UserItem from '@/components/UserItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale } from '@/Utils/Styling'
import { useRouter } from 'expo-router'
import { Camera, CaretLeft } from 'phosphor-react-native'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

const newGroup = () => {
    const router = useRouter()
    const [groupName, setGroupName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
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

    const toggleUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(u => u !== id))
        } else {
            setSelectedUsers([...selectedUsers, id])
        }
    }

    return (
        <ScreenWrapper showPattern={false} isModal={true} barStyle="dark-content" style={{ paddingHorizontal: 0 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <CaretLeft size={24} color={colors.neutral900} weight="bold" />
                </TouchableOpacity>
                <Typo size={18} fontWeight="700" color={colors.neutral900}>
                    New Group
                </Typo>
                <TouchableOpacity onPress={() => router.back()} disabled={!groupName || selectedUsers.length === 0}>
                    <Typo color={(groupName && selectedUsers.length > 0) ? colors.primary : colors.neutral300} fontWeight="700">
                        Create
                    </Typo>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Group Info Section */}
                <View style={styles.groupInfoContainer}>
                    <TouchableOpacity style={styles.cameraButton}>
                        <View style={styles.cameraIconContainer}>
                            <Camera size={scale(30)} color={colors.neutral500} weight="fill" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Group Name"
                            style={styles.input}
                            value={groupName}
                            onChangeText={setGroupName}
                            placeholderTextColor={colors.neutral400}
                        />
                    </View>
                </View>

                {/* Users List */}
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            showSelection={true}
                            selected={selectedUsers.includes(item.id)}
                            onPress={() => toggleUser(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </ScreenWrapper>
    )
}

export default newGroup

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
        paddingTop: spacingY._20,
    },
    groupInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        marginBottom: spacingY._25,
    },
    cameraButton: {
        marginRight: spacingX._15,
    },
    cameraIconContainer: {
        width: scale(70),
        height: scale(70),
        borderRadius: radius.full,
        backgroundColor: colors.neutral100,
        borderWidth: 1,
        borderColor: colors.neutral200,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flex: 1,
        height: scale(50),
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
        paddingHorizontal: spacingX._15,
        justifyContent: "center",
    },
    input: {
        fontSize: scale(15),
        color: colors.neutral900,
        fontWeight: "500",
    },
    listContent: {
        paddingBottom: spacingY._50,
    }
})
