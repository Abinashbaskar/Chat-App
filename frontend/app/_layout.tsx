import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
// import { AlertNotificationRoot } from 'react-native-alert-notification'
import { AuthProvider, useAuth } from '../context/authContext'

const InitialLayout = () => {
    const { initialized } = useAuth();

    if (!initialized) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}

const layout = () => {
    return (
        <AuthProvider>
            {/* <AlertNotificationRoot> */}
            <InitialLayout />
            {/* </AlertNotificationRoot> */}
        </AuthProvider>
    )
}

export default layout

const styles = StyleSheet.create({})