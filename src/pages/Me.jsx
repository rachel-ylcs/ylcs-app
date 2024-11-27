import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';
import ProfileIcon from '../assets/images/profile.svg';
import ScanIcon from '../assets/images/scan.svg';
import SigninIcon from '../assets/images/signin.svg';
import FriendIcon from '../assets/images/friend.svg';
import MailIcon from '../assets/images/mail.svg';
import MedalIcon from '../assets/images/medal.svg';
import ShopIcon from '../assets/images/shop.svg';

const stylesheet = createStyleSheet((theme, runtime) => ({
    backgroundWall: {
        width: '100%',
        // height: runtime.insets.top + 200,
        aspectRatio: 16 / 10,
        backgroundColor: 0x000000C0,
    },
    profileCard: {
        flexDirection: 'column',
        position: 'relative',
        top: -40,
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
        top: -40,
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
        height: 500,
        flexDirection: 'column',
        top: -40,
        marginHorizontal: 10,
        marginVertical: 5,
        marginBottom: -30,
        paddingHorizontal: 20,
    },
}));

export default function MePage({ navigation }) {
    const { styles, theme } = useStyles(stylesheet);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <ScrollView style={theme.components.Container} overScrollMode="never" showsVerticalScrollIndicator={false}>
            <FastImage style={styles.backgroundWall} />
            <TouchableWithoutFeedback onPress={() => Toast.show('跳转至登录页')}>
                <View style={[theme.components.Card, styles.profileCard]}>
                    <View style={styles.profileLayout1}>
                        <FastImage style={styles.avatar} />
                        <Text style={styles.nickname}>未登录</Text>
                    </View>
                    <Text style={styles.signature}>泸沽烟水里的过客...</Text>
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
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了好友按钮')}>
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
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了店铺按钮')}>
                    <View style={styles.functionButton}>
                        <ShopIcon width={24} height={24} fill="black" />
                        <Text style={styles.functionLabel}>店铺</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={[theme.components.Card, styles.calendarCard]}>
                <Text>活动日历正在开发中...</Text>
            </View>
        </ScrollView>
    );
}
