import { colors, radius, spacingX } from '@/constants/theme'
import { InputProps } from '@/types'
import { verticalScale } from '@/Utils/Styling'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const Input = (props: InputProps) => {
    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            {
                props.icon && props.icon
            }
            <TextInput
                style={[styles.input, props.inputStyle]}
                placeholderTextColor={colors.neutral400}
                ref={props.inputRef}
                underlineColorAndroid="transparent"
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: verticalScale(62),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: colors.neutral300,
        borderRadius: radius._30,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
        gap: spacingX._10,
        backgroundColor: colors.neutral100
    },
    input: {
        flex: 1,
        color: colors.neutral800,
        fontSize: verticalScale(18),
        borderWidth: 0,
        outlineStyle: 'none',
        outlineWidth: 0,
        boxShadow: 'none',
        paddingHorizontal: 0,
    } as any
})
