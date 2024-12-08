import React, { useRef, useEffect, useMemo, useCallback, forwardRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableWithoutFeedback, StatusBar, BackHandler, Linking } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-simple-toast';
import ProfileCard from '../components/ProfileCard';
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

    const showContactCard = useNeedAuth(useCallback(() => {
        bottomSheetRef.current?.present();
    }, []));

    const signin = useNeedAuth(useCallback(() => {
        UserAPI.signin().then((result) => {
            Toast.show('签到成功');
            refreshUser();
        }).catch((e) => {});
    }, [refreshUser]));

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
                    <TouchableWithoutFeedback onPress={showContactCard}>
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
                <ProfileCard user={user} onPress={() => {
                    if (user) {
                        navigation.navigate('User', { uid: user.uid });
                    } else {
                        navigation.navigate('Login');
                    }
                }} />
                <View style={[theme.components.Card, styles.functionCard]}>
                    <TouchableWithoutFeedback onPress={signin}>
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
                    <TouchableWithoutFeedback onPress={() => {
                        Linking.openURL(Links.taobao(config.TAOBAO_SHOP_ID)).catch(() => Toast.show('未安装淘宝'));
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
