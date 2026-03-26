import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale } from '@/Utils/Styling'
import { User } from 'phosphor-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { getFullImageUri } from '@/Utils/Common'

const ConversationItems = ({ item, index, total }: { item: any, index: number, total: number }) => {

    const lastMessage = item?.lastMessage?.text || "No messages yet";
    const time = item?.lastMessage?.createdAt ? new Date(item.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "";
    const name = item?.name || "Unknown User";
    const image = item?.image;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7}>
            {/* Avatar section */}
            <View style={styles.avatarContainer}>
                {image ? (
                    <Image source={{ uri: getFullImageUri(image) }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <User size={scale(24)} color={colors.neutral500} weight="fill" />
                    </View>
                )}
            </View>

            {/* Content section */}
            <View style={[styles.content, index === total - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.topRow}>
                    <Typo fontWeight="700" size={16} color={colors.neutral900} style={styles.name}>
                        {name}
                    </Typo>
                    <Typo size={12} color={colors.neutral500}>
                        {time}
                    </Typo>
                </View>
                <View style={styles.bottomRow}>
                    <Typo size={14} color={colors.neutral500} style={styles.lastMessage} textProps={{ numberOfLines: 1 }}>
                        {lastMessage}
                    </Typo>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ConversationItems

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: spacingX._10,
    },
    avatarContainer: {
        paddingVertical: spacingY._12,
    },
    avatar: {
        width: scale(54),
        height: scale(54),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
    },
    avatarPlaceholder: {
        width: scale(54),
        height: scale(54),
        borderRadius: radius.full,
        backgroundColor: colors.neutral200,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingRight: spacingX._10,
        marginLeft: spacingX._10,
        paddingVertical: spacingY._15,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.neutral200,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._5,
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    name: {
        flex: 1,
        marginRight: spacingX._10,
    },
    lastMessage: {
        flex: 1,
    }
})