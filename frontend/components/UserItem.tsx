import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale } from '@/Utils/Styling'
import { User } from 'phosphor-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface UserItemProps {
    user: any;
    onPress?: () => void;
    selected?: boolean;
    showSelection?: boolean;
}

const UserItem = ({ user, onPress, selected, showSelection = false }: UserItemProps) => {
    const name = user?.name || "Unknown User";
    const image = user?.image;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            {/* Avatar section */}
            <View style={styles.avatarContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <User size={scale(24)} color={colors.neutral500} weight="fill" />
                    </View>
                )}
            </View>

            {/* Content section */}
            <View style={styles.content}>
                <Typo fontWeight="600" size={16} color={colors.neutral900} style={styles.name}>
                    {name}
                </Typo>

                {showSelection && (
                    <View style={[
                        styles.selectionCircle,
                        selected && styles.selectedCircle
                    ]}>
                        {selected && <View style={styles.innerCircle} />}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default UserItem

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
    },
    avatarContainer: {
        paddingVertical: spacingY._10,
    },
    avatar: {
        width: scale(50),
        height: scale(50),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
    },
    avatarPlaceholder: {
        width: scale(50),
        height: scale(50),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: spacingX._15,
        paddingVertical: spacingY._15,
    },
    name: {
        flex: 1,
    },
    selectionCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.neutral300,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedCircle: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.white,
    }
})
