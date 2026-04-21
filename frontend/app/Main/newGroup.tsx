import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import UserItem from '@/components/UserItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { getContacts, newConversation } from '@/socket/socketEVents'
import { scale } from '@/Utils/Styling'
import { Alerts } from '@/Utils/Alerts'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Camera, CaretLeft } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native'

const newGroup = () => {
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [groupName, setGroupName] = useState('')
    const [groupImage, setGroupImage] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [users, setUsers] = useState<any[]>([])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setGroupImage(base64Img);
        }
    };

    useEffect(() => {
        const handleContacts = (response: any) => {
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
    }, [])

    const groupNameRef = React.useRef(groupName);

    React.useEffect(() => {
        groupNameRef.current = groupName;
    }, [groupName]);

    useEffect(() => {
        const handleNewConversation = (response: any) => {
            if (response.success && response.data) {
                const conv = response.data;
                console.log("handleNewConversation in newGroup received:", JSON.stringify(response));
                
                // If it's a group and matches the name we just tried to create
                // We loosen the check slightly to handle any name variations from backend
                const isMyGroup = conv.type === 'group' && 
                                 (conv.name?.trim() === groupNameRef.current?.trim());

                if (isMyGroup) {
                    Alerts.success("Success", "Group created successfully!");
                    setTimeout(() => {
                        router.back();
                    }, 500);
                }
            }
        };

        newConversation(handleNewConversation);
        return () => {
            newConversation(handleNewConversation, true);
        };
    }, [])

    const toggleUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(u => u !== id))
        } else {
            setSelectedUsers([...selectedUsers, id])
        }
    }

    const handleCreateGroup = () => {
        if (!groupName || selectedUsers.length === 0 || !currentUser) return;
        let currentUserId = (currentUser as any).id || (currentUser as any)._id;

        newConversation({
            type: "group",
            name: groupName,
            avatar: groupImage,
            participants: [currentUserId, ...selectedUsers],
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
                    New Group
                </Typo>
                <TouchableOpacity onPress={handleCreateGroup} disabled={!groupName || selectedUsers.length === 0}>
                    <Typo color={(groupName && selectedUsers.length > 0) ? colors.primary : colors.neutral300} fontWeight="700">
                        Create
                    </Typo>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Group Info Section */}
                <View style={styles.groupInfoContainer}>
                    <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                        <View style={styles.cameraIconContainer}>
                            {groupImage ? (
                                <Image source={{ uri: groupImage }} style={styles.groupImage} />
                            ) : (
                                <Camera size={scale(30)} color={colors.neutral500} weight="fill" />
                            )}
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
    groupImage: {
        width: '100%',
        height: '100%',
        borderRadius: radius.full,
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
