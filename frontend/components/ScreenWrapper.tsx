import { colors } from "@/constants/theme";
import { ScreenWrapperProps } from "@/types";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    Platform,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({
    style,
    children,
    showPattern = false,
    isModal = false,
    bgOpacity = 0.5,
}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS == "ios" ? height * 0.06 : 50;
    let paddingBottom = 0;

    if (isModal) {
        paddingTop = Platform.OS == "ios" ? height * 0.02 : 0;
        paddingBottom = height * 0.02;
    }

    return (
        <ImageBackground
            source={require("../assets/images/bgPattern.png")}
            style={{
                flex: 1,
                backgroundColor: isModal ? colors.white : colors.neutral900,
            }}
            imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
        >
            <View
                style={[
                    {
                        paddingTop,
                        paddingBottom,
                        flex: 1,
                    },
                    style,
                ]}
            >
                <StatusBar barStyle={"light-content"} translucent backgroundColor="transparent" />
                {children}
            </View>
        </ImageBackground>
    );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
