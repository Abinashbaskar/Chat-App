import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Welcome = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <TouchableOpacity onPress={() => router.push('/ChatList')} style={styles.button}>
                <Text style={styles.buttonText}>Go to Chats</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    button: {
        padding: 15,
        backgroundColor: '#007AFF',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});