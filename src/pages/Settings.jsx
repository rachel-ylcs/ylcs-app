import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableHighlight, Switch, Alert } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { encryptStorage } from '../store';
import { useUserStore } from '../store/User';
import { UserAPI } from '../api/ylcs';
import RightArrowIcon from '../assets/images/right_arrow.svg';

const styles = StyleSheet.create({
    section: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 14,
        color: 'steelblue',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderTopColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    itemKey: {
        fontSize: 16,
        color: 'black',
        marginHorizontal: 10,
    },
    itemValue: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
    },
    valueText: {
        fontSize: 16,
        color: 'black',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'lightgray',
    },
    wall: {
        height: 60,
        aspectRatio: 16 / 9,
        backgroundColor: 'lightgray',
    },
    primaryColor: {
        width: 50,
        height: 30,
        backgroundColor: 'steelblue',
        borderRadius: 5,
    },
    footer: {
        marginVertical: 20,
    },
    footerButton: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    logout: {
        color: 'red',
    },
});

export default function SettingsPage({ navigation }) {
    const { theme } = useStyles();
    const { data: user, refresh: refreshUser } = useUserStore();

    const changeAvatar = useNeedAuth(useCallback(async () => {
        let result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (result.didCancel) {
            return;
        } else if (result.errorCode) {
            Toast.show(result.errorMessage);
            return;
        }
        try {
            let file = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName,
                type: result.assets[0].type,
            };
            await UserAPI.updateAvatar(file);
            Toast.show('头像修改成功');
            refreshUser();
        } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    const changeId = useNeedAuth(useCallback(() => {
        if (user?.coin < 5) {
            Toast.show('你的银币不够哦~');
            return;
        }
        Alert.prompt('修改ID', '', [
            {
                text: '取消',
                style: 'cancel',
            },
            {
                text: '确定',
                onPress: async (text) => {
                    if (!text) {
                        Toast.show('ID不能为空');
                        return;
                    }
                    try {
                        await UserAPI.updateName(text);
                        Toast.show('ID修改成功');
                        await refreshUser();
                    } catch (error) {}
                },
            },
        ], 'default', '', 'default', {
            cancelable: true,
            placeholder: '请输入新的ID（5银币）',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    const changeSignature = useNeedAuth(useCallback(() => {
        Alert.prompt('修改个性签名', '', [
            {
                text: '取消',
                style: 'cancel',
            },
            {
                text: '确定',
                onPress: async (text) => {
                    if (!text) {
                        Toast.show('个性签名不能为空');
                        return;
                    }
                    try {
                        await UserAPI.updateSignature(text);
                        Toast.show('个性签名修改成功');
                        await refreshUser();
                    } catch (error) {}
                },
            },
        ], 'default', '', 'default', {
            cancelable: true,
            placeholder: '请输入新的个性签名',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    const changeWall = useNeedAuth(useCallback(async () => {
        let result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (result.didCancel) {
            return;
        } else if (result.errorCode) {
            Toast.show(result.errorMessage);
            return;
        }
        try {
            let file = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName,
                type: result.assets[0].type,
            };
            await UserAPI.updateBackground(file);
            Toast.show('背景墙修改成功');
            await refreshUser();
        } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    const logout = useNeedAuth(useCallback(() => {
        Alert.alert('退出登录', '确定要退出登录吗？', [
            {
                text: '取消',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: '确定',
                onPress: async () => {
                    try {
                        await UserAPI.logout();
                        encryptStorage.clearStore();
                        await refreshUser();
                    } catch (error) {}
                },
            },
        ], {
            cancelable: true,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    // FIXME 静态资源缺少缓存策略导致修改头像后无法刷新
    const now = Date.now();

    return (
        <ScrollView style={theme.components.Container} overScrollMode="never" showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text style={styles.title}>账号</Text>
                <TouchableHighlight onPress={changeAvatar}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>头像</Text>
                        <FastImage style={[styles.itemValue, styles.avatar]} source={user ? { uri: `${user.avatar}?${now}` } : undefined} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={changeId}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>ID</Text>
                        <Text style={[styles.itemValue, styles.valueText]} numberOfLines={1}>{user?.name}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={changeSignature}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>个性签名</Text>
                        <Text style={[styles.itemValue, styles.valueText]} numberOfLines={1}>{user?.signature}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={changeWall}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>背景墙</Text>
                        <FastImage style={[styles.itemValue, styles.wall]} source={user ? { uri: `${user.wall}?${now}` } : undefined} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>邀请人</Text>
                        <Text style={[styles.itemValue, styles.valueText]} numberOfLines={1}>{user?.inviter}</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>界面</Text>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>深色模式</Text>
                        <Text style={[styles.itemValue, styles.valueText]}>跟随系统</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => Toast.show('即将支持自定义主题色')}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>主题色</Text>
                        <View style={[styles.itemValue, styles.primaryColor]} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => Toast.show('即将支持自定义字体')}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>字体</Text>
                        <Text style={[styles.itemValue, styles.valueText]}>默认</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>语言</Text>
                        <Text style={[styles.itemValue, styles.valueText]}>中文（简体）</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>播放器</Text>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>与其他应用同时播放</Text>
                        <Switch value={false} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>状态栏歌词</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>桌面歌词</Text>
                        <Switch value={false} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>锁屏显示</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>桌面小部件/卡片/原子服务</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>歌单云备份</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>其他</Text>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>自动下载原图</Text>
                        <View style={styles.itemValue}>
                            {/* 不自动下载/WiFi下自动下载/任何网络下都自动下载 */}
                            <Text style={styles.valueText}>不自动下载</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>清理缓存</Text>
                        <View style={styles.itemValue}>
                            <Text style={styles.valueText}>0.0MB</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>个人信息收集清单</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>第三方共享信息清单</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>第三方SDK列表</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => navigation.navigate('About')}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>关于茶舍</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.footer}>
                <TouchableHighlight onPress={logout}>
                    <View style={styles.footerButton}>
                        <Text style={[styles.valueText, styles.logout]}>退出登录</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
}
