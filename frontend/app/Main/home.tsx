import ConversationItems from '@/components/ConversationItems'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'
import { GearSix } from 'phosphor-react-native'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

const home = () => {
    const { user } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Direct Messages')
    const [conversations, setConversations] = useState([
        {
            id: 1,
            type: "direct",
            name: "Charlie",
            lastMessage: {
                text: "Thanks!",
                createdAt: "2026-06-23T10:00:00Z"
            }
        },
        {
            id: 2,
            type: "direct",
            name: "Bob",
            lastMessage: {
                text: "Can you send the files?Can you send the files?Can you send the files?Can you send the files?",
                createdAt: "2026-06-23T09:00:00Z"
            }
        },



        {
            id: 4,
            type: "group",
            name: "Engineering Team",
            lastMessage: {
                text: "Let's review the PRs",
                createdAt: "2026-06-24T10:00:00Z"
            }
        },
        {
            id: 5,
            type: "group",
            name: "Family Group",
            lastMessage: {
                text: "Dinner tonight?",
                createdAt: "2026-06-24T09:00:00Z"
            }
        },
        {
            id: 6,
            type: "group",
            name: "Fitness Junkies",
            lastMessage: {
                text: "Leg day today! 💪",
                createdAt: "2026-06-23T18:00:00Z"
            }
        }
    ])

    const tabs = ['Direct Messages', 'Groups']

    const currentData = conversations
        .filter((item: any) => {
            if (activeTab === "Direct Messages") return item.type === "direct";
            return item.type === "group";
        })
        .sort((a: any, b: any) => {
            const aDate = a?.lastMessage?.createdAt || a.createdAt;
            const bDate = b?.lastMessage?.createdAt || b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        })

    return (
        <ScreenWrapper showPattern={true} style={{ paddingBottom: 0, paddingHorizontal: 0 }}>
            <View style={styles.header}>
                <Typo color={colors.white} size={20} fontWeight={"500"}>
                    Welcome back, <Typo color={colors.white} size={20} fontWeight={"700"}>{user?.name}</Typo> 🤙
                </Typo>
                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/Main/profile')}>
                    <GearSix size={24} color={colors.white} weight="fill" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tab,
                                    isActive && styles.activeTab
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Typo
                                    color={isActive ? colors.neutral900 : colors.neutral500}
                                    fontWeight={isActive ? "700" : "500"}
                                    size={14}
                                >
                                    {tab}
                                </Typo>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <ConversationItems
                            item={item}
                            index={index}
                            total={currentData.length}
                        />
                    )}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                />
            </View>
        </ScreenWrapper>
    )
}

export default home

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
    },
    settingsButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.neutral800,
        borderRadius: radius.full,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._40,
        borderTopRightRadius: radius._40,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
    },
    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        marginBottom: spacingY._20,
        paddingHorizontal: spacingX._5,
    },
    tab: {
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._10,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    list: {
        flex: 1,
        width: "100%",
    },
    listContent: {
        paddingBottom: spacingY._20,
    }
})