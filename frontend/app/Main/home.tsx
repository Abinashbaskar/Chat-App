import Buttons from '@/components/Buttons'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { GearSix } from 'phosphor-react-native'
import { useRouter } from 'expo-router'

const home = () => {
    const { user } = useAuth()
    const router = useRouter()

    return (
        <ScreenWrapper showPattern={true} style={{ paddingBottom: 0, paddingHorizontal: 0 }}>
            <View style={styles.header}>
                <Typo color={colors.white} size={20} fontWeight={"500"}>
                    Welcome back, <Typo color={colors.white} size={20} fontWeight={"700"}>{user?.name}</Typo> 🤙
                </Typo>
                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/Main/profile')}>
                    <GearSix size={24} color={colors.white} weight="fill" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Content will live here */}
            </View>
        </ScreenWrapper>
    )
}

export default home

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
    },
    settingsButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.neutral800,
        borderRadius: radius.full,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._40,
        borderTopRightRadius: radius._40,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
    }
})