import BackButton from '@/components/BackButton';
import Buttons from '@/components/Buttons';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/Utils/Styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const onSubmit = async () => {
        setLoading(true);
        console.log('Email:', emailRef.current);
        console.log('Password:', passwordRef.current);
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton />
                        <Typo size={17} color={colors.white}>Need some help?</Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={'600'} >Welcome Back</Typo>
                                <Typo size={15} color={colors.neutral600} >Please login to continue</Typo>
                            </View>

                            <View style={{ gap: verticalScale(20) }}>
                                <Input
                                    placeholder="Enter your email"
                                    icon={<Icons.At size={verticalScale(26)} color={colors.neutral600} weight='light' />}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={(value) => (emailRef.current = value)}
                                />
                                <Input
                                    placeholder="Enter your password"
                                    secureTextEntry
                                    icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral600} weight='light' />}
                                    onChangeText={(value) => (passwordRef.current = value)}
                                />

                                <Typo size={14} color={colors.neutral600} style={{ alignSelf: 'flex-end' }}>
                                    Forgot Password?
                                </Typo>

                                <View style={{ marginTop: spacingY._20 }}>
                                    <Buttons loading={loading} onPress={onSubmit}>
                                        <Typo size={20} color={colors.black} fontWeight={'bold'}>Login</Typo>
                                    </Buttons>
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <Typo size={14} color={colors.neutral600}>Don't have an account?</Typo>
                                <Typo size={14} color={colors.primaryDark} fontWeight={'700'}
                                    onPress={() => router.navigate('/Auth/Register' as any)}
                                > Sign Up</Typo>
                            </View>

                        </ScrollView>

                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
    },
    form: {
        gap: spacingY._20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: spacingY._10
    }
});
