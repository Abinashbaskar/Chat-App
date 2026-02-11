import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { AlertNotificationRoot } from 'react-native-alert-notification'

const layout = () => {
    return (
        <AlertNotificationRoot>
            <Stack screenOptions={{ headerShown: false }} />
        </AlertNotificationRoot>
    )
}

export default layout

const styles = StyleSheet.create({})