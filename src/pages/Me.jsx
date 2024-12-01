import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableWithoutFeedback, StatusBar, Linking } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';
import EventCalendar from '../components/EventCalendar';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import { useActivitiesStore } from '../store/Activities';
import { Links } from '../utils/util';
import { config } from '../config';
import ProfileIcon from '../assets/images/profile.svg';
import ScanIcon from '../assets/images/scan.svg';
import SettingsIcon from '../assets/images/settings.svg';
import SigninIcon from '../assets/images/signin.svg';
import FriendIcon from '../assets/images/friend.svg';
import MailIcon from '../assets/images/mail.svg';
import MedalIcon from '../assets/images/medal.svg';
import ShopIcon from '../assets/images/shop.svg';

const stylesheet = createStyleSheet((theme, runtime) => ({
    headerActions: {
        flexDirection: 'row',
    },
    backgroundWrapper: {
        width: '100%',
        marginBottom: -40,
    },
    backgroundWall: {
        width: '100%',
        // height: runtime.insets.top + 200,
        zIndex: -1,
        aspectRatio: 4 / 3,
        backgroundColor: 0x000000C0,
    },
    profileCard: {
        flexDirection: 'column',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    profileLayout1: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    avatar: {
        position: 'absolute',
        top: -50,
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 40,
    },
    nickname: {
        flex: 1,
        fontSize: 16,
        color: 'black',
        marginLeft: 100,
    },
    signature: {
        fontSize: 14,
        color: 'black',
        marginTop: 10,
    },
    profileLayout2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    profileData: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    profileDataNum: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    profileDataLabel: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
    },
    functionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 30,
    },
    functionButton: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    functionLabel: {
        fontSize: 14,
        color: 'black',
        marginTop: 2,
    },
    calendarCard: {
        flexDirection: 'column',
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 0,
        overflow: 'hidden',
    },
}));

export default function MePage({ navigation }) {
    const { styles, theme } = useStyles(stylesheet);
    const { data, refreshing, error, refresh } = useActivitiesStore();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerActions}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
                        <ProfileIcon style={{ marginRight: theme.sizes.xl }}
                            width={theme.sizes.xxxl} height={theme.sizes.xxxl} fill={theme.colors.white} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('ScanCode')}>
                        <ScanIcon style={{ marginRight: theme.sizes.xl }}
                            width={theme.sizes.xxxl} height={theme.sizes.xxxl} fill={theme.colors.white} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
                        <SettingsIcon style={{ marginRight: theme.sizes.xl }}
                            width={theme.sizes.xxxl} height={theme.sizes.xxxl} fill={theme.colors.white} />
                    </TouchableWithoutFeedback>
                </View>
            ),
            headerTransparent: true,
            headerTitle: '',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content', true);

            return () => StatusBar.setBarStyle('dark-content', true);
        }, [])
    );

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dates = useMemo(() => {
        let markedDates = {};
        data?.forEach((activity) => {
            markedDates[activity.ts] = { marked: true, dotColor: 'steelblue', title: activity.title };
        });
        return markedDates;
    }, [data]);

    return (
        <ScrollView style={theme.components.Container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            } overScrollMode="never" showsVerticalScrollIndicator={false}>
            <View style={styles.backgroundWrapper}>
                <FastImage style={styles.backgroundWall} />
            </View>
            <TouchableWithoutFeedback onPress={() => Toast.show('跳转至登录页')}>
                <View style={[theme.components.Card, styles.profileCard]}>
                    <View style={styles.profileLayout1}>
                        <FastImage style={styles.avatar} />
                        <Text style={styles.nickname}>未登录</Text>
                    </View>
                    <Text style={styles.signature}>泸沽烟水里的过客…</Text>
                    <View style={styles.profileLayout2}>
                        <View style={styles.profileData}>
                            <Text style={styles.profileDataNum}>1</Text>
                            <Text style={styles.profileDataLabel}>等级</Text>
                        </View>
                        <View style={styles.profileData}>
                            <Text style={styles.profileDataNum}>0</Text>
                            <Text style={styles.profileDataLabel}>银币</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={[theme.components.Card, styles.functionCard]}>
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了签到按钮')}>
                    <View style={styles.functionButton}>
                        <SigninIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>签到</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了徽章按钮')}>
                    <View style={styles.functionButton}>
                        <MedalIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>徽章</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => Toast.show('好友功能正在开发中，敬请期待！')}>
                    <View style={styles.functionButton}>
                        <FriendIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>好友</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了邮箱按钮')}>
                    <View style={styles.functionButton}>
                        <MailIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>邮箱</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={async () => {
                    try {
                        await Linking.openURL(Links.taobao(config.TAOBAO_SHOP_ID));
                    } catch (e) {
                        Toast.show('未安装淘宝');
                    }
                }}>
                    <View style={styles.functionButton}>
                        <ShopIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>店铺</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={[theme.components.Card, styles.calendarCard]}>
                {data ? (
                    <EventCalendar
                        markedDates={dates}
                        onDayPress={(day) => {
                            const activity = data.find((activity) => activity.ts === day.dateString);
                            if (activity) {
                                navigation.navigate('EventDetail', { ts: activity.ts });
                            }
                        }}
                    />
                ) : (
                    !error ? (
                        <LoadingIndicator text="加载活动日历中..." />
                    ) : (
                        <OfflineIndicator onRetry={refresh} />
                    )
                )}
            </View>
        </ScrollView>
    );
}
