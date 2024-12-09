import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableHighlight, Alert } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { encryptStorage } from '../store';
import { useUserStore } from '../store/User';
import { UserAPI } from '../api/ylcs';
import { version } from '../../app.json';
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
    logout: {
        color: 'darkred',
    },
    primaryColor: {
        width: 50,
        height: 30,
        backgroundColor: 'steelblue',
        borderRadius: 5,
    },
    textFont: {
        fontSize: 16,
        color: 'black',
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
                <Text style={styles.title}>账号设置</Text>
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
                <TouchableHighlight onPress={logout}>
                    <View style={styles.item}>
                        <Text style={[styles.itemKey, styles.logout]}>退出登录</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>个性设置</Text>
                <TouchableHighlight onPress={() => Toast.show('即将支持自定义主题色')}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>主题色</Text>
                        <View style={[styles.itemValue, styles.primaryColor]} />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => Toast.show('即将支持自定义字体')}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>字体</Text>
                        <Text style={[styles.itemValue, styles.valueText, styles.textFont]}>默认</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>播放器设置</Text>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>与其他应用同时播放</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>歌词设置</Text>
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
                <Text style={styles.title}>通用设置</Text>
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
                        <Text style={styles.itemKey}>用户体验改进计划</Text>
                        <View style={styles.itemValue}>
                            <Text style={styles.valueText}>未加入</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>提交反馈</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>检查更新</Text>
                        <View style={styles.itemValue}>
                            <Text style={styles.valueText}>{`v${version}`}</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>隐私政策</Text>
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
        </ScrollView>
    );
}
