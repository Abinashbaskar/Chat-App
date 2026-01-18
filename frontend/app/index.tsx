import { colors } from '@/constants/theme';
import { verticalScale } from '@/Utils/Styling';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';

const index = () => {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/Auth/Welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.neutral900} />
      <Animated.Image
        source={require('../assets/images/splashImage.png')}
        style={[
          styles.welcome,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral900,
  },
  welcome: {
    height: verticalScale(200),
    width: verticalScale(200),
  },
});