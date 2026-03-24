import { Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from '../context/authContext'

const InitialLayout = () => {
    const { initialized, token } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === 'Auth';

        if (token && inAuthGroup) {
            router.replace('/Main/home');
        } else if (!token && !inAuthGroup) {
            router.replace('/Auth/Welcome');
        }
    }, [initialized, token, segments]);

    if (!initialized) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}

const layout = () => {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                {/* <AlertNotificationRoot> */}
                <InitialLayout />
                {/* </AlertNotificationRoot> */}
            </AuthProvider>
        </SafeAreaProvider>
    )
}

export default layout

const styles = StyleSheet.create({})