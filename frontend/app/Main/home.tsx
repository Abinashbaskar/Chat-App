import Buttons from '@/components/Buttons'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import React from 'react'

const home = () => {
    const { user, signOut } = useAuth()
    const handlelogout = async () => {
        await signOut();

    }
    return (
        <ScreenWrapper showPattern={true}>
            <Typo color={colors.white} size={30} fontWeight={"700"}>
                Hello,
            </Typo>
            <Typo color={colors.primary} size={30} fontWeight={"700"}>
                {user?.name}
            </Typo>
            <Buttons onPress={handlelogout} style={{ marginTop: 20 }}>
                <Typo>Logout</Typo>
            </Buttons>
        </ScreenWrapper>
    )
}

export default home