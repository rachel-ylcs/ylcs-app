import React, { useRef, useEffect, useMemo, useCallback, forwardRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableWithoutFeedback, StatusBar, BackHandler, Linking } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-simple-toast';
import LevelLabel from '../components/LevelLabel';
import EventCalendar from '../components/EventCalendar';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { useUserStore } from '../store/User';
import { useActivitiesStore } from '../store/Activities';
import { UserAPI } from '../api/ylcs';
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
    bottomSheet: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 20,
    },
    cardAvatar: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 50,
    },
    cardName: {
        fontSize: 20,
        color: 'steelblue',
        marginTop: 10,
    },
    cardTip: {
        fontSize: 16,
        color: 'black',
        marginTop: 10,
    },
    cardQrCode: {
        marginTop: 20,
        marginBottom: 40,
    },
}));

const ContactCardSheet = forwardRef(function ({ navigation, user }, ref) {
    const { styles, theme } = useStyles(stylesheet);
    const listener = useRef(null);

    const handleChange = useCallback((index) => {
        if (index === 0) {
            listener.current = BackHandler.addEventListener('hardwareBackPress', () => {
                ref.current?.close();
                return true;
            });
        } else {
            listener.current?.remove();
        }
    }, [ref]);

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ), []);

    return (
        <BottomSheetModal ref={ref} index={0} backdropComponent={renderBackdrop} onChange={handleChange}>
            <BottomSheetView style={styles.bottomSheet}>
                <FastImage style={styles.cardAvatar} source={{ uri: user?.avatar }} />
                <Text style={styles.cardName}>{user?.name}</Text>
                <Text style={styles.cardTip}>扫我添加好友</Text>
                <View style={styles.cardQrCode}>
                    <QRCode
                        value={`rachel://yinlin/openProfile?uid=${user?.uid}`}
                        size={150}
                        logo={require('../assets/images/logo.webp')}
                        logoSize={40}
                        logoMargin={5}
                        logoBorderRadius={10}
                        ecl="H"
                    />
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default function MePage({ navigation }) {
    const { styles, theme } = useStyles(stylesheet);
    const { data: user, refresh: refreshUser } = useUserStore();
    const { data, refreshing, error, refresh } = useActivitiesStore();
    const bottomSheetRef = useRef(null);

    const showContactCard = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const signin = useCallback(() => {
        UserAPI.signin().then(() => {
            Toast.show('签到成功');
            refreshUser();
        }).catch((e) => {});
    }, [refreshUser]);

    const dates = useMemo(() => {
        let markedDates = {};
        data?.forEach((activity) => {
            markedDates[activity.ts] = { marked: true, dotColor: 'steelblue', title: activity.title };
        });
        return markedDates;
    }, [data]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerRight: () => (
                <View style={styles.headerActions}>
                    <TouchableWithoutFeedback onPress={useNeedAuth(showContactCard)}>
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
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content', true);

            return () => StatusBar.setBarStyle('dark-content', true);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            refreshUser();
        }, [refreshUser])
    );

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <ScrollView style={theme.components.Container} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                } overScrollMode="never" showsVerticalScrollIndicator={false}>
                <View style={styles.backgroundWrapper}>
                    <FastImage style={styles.backgroundWall} source={{ uri: user?.wall }} />
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    if (user) {
                        navigation.navigate('User', { uid: user.uid });
                    } else {
                        navigation.navigate('Login');
                    }
                }}>
                    <View style={[theme.components.Card, styles.profileCard]}>
                        <View style={styles.profileLayout1}>
                            <FastImage style={styles.avatar} source={{ uri: user?.avatar }} />
                            <Text style={styles.nickname}>{user?.name ?? '点击登录'}</Text>
                            <LevelLabel level={user?.level}/>
                        </View>
                        <Text style={styles.signature}>{user?.signature ?? '泸沽烟水里的过客…'}</Text>
                        <View style={styles.profileLayout2}>
                            <View style={styles.profileData}>
                                <Text style={styles.profileDataNum}>{String(user?.level.level ?? 1)}</Text>
                                <Text style={styles.profileDataLabel}>等级</Text>
                            </View>
                            <View style={styles.profileData}>
                                <Text style={styles.profileDataNum}>{String(user?.coin ?? 0)}</Text>
                                <Text style={styles.profileDataLabel}>银币</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={[theme.components.Card, styles.functionCard]}>
                    <TouchableWithoutFeedback onPress={useNeedAuth(signin)}>
                        <View style={styles.functionButton}>
                            <SigninIcon width={24} height={24} fill="black" />
                            <Text style={styles.functionLabel}>签到</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => Toast.show('徽章功能正在开发中，敬请期待！')}>
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
                    <TouchableWithoutFeedback onPress={useNeedAuth(() => navigation.navigate('Mailbox'))}>
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
            <ContactCardSheet ref={bottomSheetRef} navigation={navigation} user={user} />
        </>
    );
}
