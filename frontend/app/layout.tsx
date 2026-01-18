import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default layout

const styles = StyleSheet.create({})