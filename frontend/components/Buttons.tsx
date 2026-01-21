import { colors } from '@/constants/theme';
import { ButtonProps } from '@/types';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

const Buttons = ({ style, onPress, children, loading }: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={colors.white} />
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

export default Buttons;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});
