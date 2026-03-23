import Buttons from '@/components/Buttons'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { updateSocket } from '@/socket/socketEVents'
import { UserDataProps } from '@/types'
import { Alerts } from '@/Utils/Alerts'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { PencilSimple, SignOut, User } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native'

const profile = () => {
    const { user, signOut, updateToken } = useAuth()
    const router = useRouter()
    const [userData, SetUserData] = useState<UserDataProps>({
        name: "",
        email: "",
        avatar: null,
    })

    useEffect(() => {
        SetUserData({
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || ""
        })
    }, [user])

    useEffect(() => {
        const handleProfileUpdate = (response: any) => {
            if (response.success && response.token) {
                updateToken(response.token);
                console.log("Profile updated successfully", response);
                Alerts.success("Success", response.msg || "Profile updated successfully");
                router.back();
            } else if (response.success === false) {
                Alerts.error("Error", response.msg || "Failed to update profile");
            }
        };

        updateSocket(handleProfileUpdate);
        return () => {
            updateSocket(handleProfileUpdate, true);
        };
    }, []);

    const handleUpdate = async () => {
        let { name, avatar } = userData;
        if (!name) {
            Alerts.error("Error", "Please fill all the fields");
            return;
        }

        // Emit socket event to update profile name
        updateSocket({ name, avatar });
        // The success message will be handled by the socket listener
    }

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
            SetUserData({ ...userData, avatar: base64Img });
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        await signOut();
                        Alerts.success("Success", "Logout successfully");
                    },
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <ScreenWrapper showPattern={false} style={{ backgroundColor: colors.white }} barStyle="dark-content">
            <View style={styles.header}>
                <Typo size={20} fontWeight={"700"} color={colors.text}>Update Profile</Typo>
            </View>

            <View style={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {userData.avatar ? (
                            <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
                        ) : (
                            <User size={80} color={colors.neutral400} weight="fill" />
                        )}
                    </View>
                    <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                        <PencilSimple size={18} color={colors.text} weight="bold" />
                    </TouchableOpacity>
                </View>

                {/* Form fields */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Typo size={14} color={colors.neutral700} style={{ marginLeft: spacingX._10, marginBottom: spacingY._5 }}>Email</Typo>
                        <Input
                            placeholder="Email Address"
                            value={user?.email}
                            editable={false}
                            containerStyle={{ backgroundColor: colors.neutral300 }} // Disabled look
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Typo size={14} color={colors.neutral700} style={{ marginLeft: spacingX._10, marginBottom: spacingY._5 }}>Name</Typo>
                        <Input
                            placeholder="Full Name"
                            value={userData.name}
                            onChangeText={(text) => SetUserData({ ...userData, name: text })}
                            containerStyle={{ backgroundColor: colors.neutral100 }}
                        />
                    </View>
                </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <SignOut size={28} color={colors.white} weight="bold" />
                </TouchableOpacity>
                <Buttons style={styles.updateButton} onPress={handleUpdate}>
                    <Typo color={colors.text} fontWeight="700">Update</Typo>
                </Buttons>
            </View>
        </ScreenWrapper>
    )
}

export default profile

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        paddingBottom: spacingY._20,
        position: 'relative'
    },
    content: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._40,
        alignItems: 'center'
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacingY._40,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.neutral300,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: colors.white,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    formContainer: {
        width: '100%',
        gap: spacingY._20,
    },
    inputGroup: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
        paddingTop: spacingY._15,
        gap: spacingX._15,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
    },
    logoutButton: {
        width: 60,
        height: 60,
        borderRadius: radius._20,
        backgroundColor: colors.rose,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButton: {
        flex: 1,
        height: 60,
        borderRadius: radius._20,
    }
})
