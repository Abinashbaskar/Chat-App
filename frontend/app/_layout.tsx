import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { AuthProvider } from '../context/authContext'

const layout = () => {
    return (
        <AuthProvider>
            <AlertNotificationRoot>
                <Stack screenOptions={{ headerShown: false }} />
            </AlertNotificationRoot>
        </AuthProvider>
    )
}

export default layout

const styles = StyleSheet.create({})