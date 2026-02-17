import Buttons from '@/components/Buttons'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import React from 'react'

const home = () => {
    const { user } = useAuth()
    return (
        <ScreenWrapper>
            <Typo color={colors.white}>
                Home
            </Typo>
            <Buttons>
                Logout
            </Buttons>
        </ScreenWrapper>
    )
}

export default home