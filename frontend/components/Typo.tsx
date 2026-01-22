import { colors } from '@/constants/theme'
import { TypoProps } from '@/types'
import { verticalScale } from '@/Utils/Styling'
import React from 'react'
import { Text, View } from 'react-native'

const Typo = ({
    size = 16,
    color = colors.text,
    fontWeight = '400',
    children,
    style,
    textProps = {},
    onPress,
}: TypoProps) => {

    const textStyle = [
        {
            fontSize: verticalScale(size),
            color

        },
        style,
    ]
    return (
        <View>
            <Text
                style={[
                    {
                        fontSize: size,
                        color,
                        fontWeight,
                    },
                    style,
                ]}
                onPress={onPress}
                {...textProps}
            >
                {children}
            </Text>
        </View>
    )
}

export default Typo
