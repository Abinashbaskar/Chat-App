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
        <ScreenWrapper>
            <Typo color={colors.white}>
                Home
            </Typo>
            <Buttons onPress={handlelogout}>
                <Typo>Logout</Typo>
            </Buttons>
        </ScreenWrapper>
    )
}

export default home