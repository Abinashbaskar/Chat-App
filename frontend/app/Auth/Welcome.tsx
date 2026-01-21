import Buttons from '@/components/Buttons';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/Utils/Styling';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const Welcome = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setLoading(false);
        }, [])
    );

    const handleGetStarted = () => {
        setLoading(true);
        router.push('/Auth/Register')
    };

    return (
        <ScreenWrapper showPattern={true}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Typo color={colors.white} size={43} fontWeight="900">
                        Wave
                    </Typo>
                </View>

                <View style={styles.imageContainer}>
                    <Animated.Image
                        entering={FadeIn.duration(700).springify()}
                        source={require('../../assets/images/welcome.png')}
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    />
                </View>

                <View>
                    <Typo size={33} fontWeight="800" color={colors.white}>
                        Stay Connected
                    </Typo>
                    <Typo size={33} fontWeight="800" color={colors.white}>
                        with your friends
                    </Typo>
                    <Typo size={33} fontWeight="800" color={colors.white}>
                        and family
                    </Typo>
                </View>

                {/* ✅ Button usage */}
                {
                    loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <Buttons onPress={handleGetStarted} style={styles.button}>
                            <Typo color={colors.black} size={23} fontWeight="700">
                                Get Started
                            </Typo>
                        </Buttons>
                    )
                }
            </View>
        </ScreenWrapper>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: spacingX._20,
        marginHorizontal: spacingY._10,
    },
    imageContainer: {
        alignItems: 'center',
    },
    welcomeImage: {
        height: verticalScale(300),
        width: '100%',
    },
    button: {
        marginTop: spacingY._10,
        backgroundColor: "white",
    },
    loaderContainer: {
        marginTop: spacingY._10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
