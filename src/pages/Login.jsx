import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Toast from 'react-native-simple-toast';
import { UserAPI } from '../api/ylcs';
import { encryptStorage } from '../store';

const stylesheet = createStyleSheet((theme, runtime) => ({
    container: {
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        flex: 1,
        resizeMode: 'contain',
        marginHorizontal: 20,
    },
    logoBrand: {
        aspectRatio: 1,
    },
    logoTitle: {
        aspectRatio: 8 / 15,
    },
    fragment: {
        flexDirection: 'column',
        marginHorizontal: 30,
    },
    inputLabel: {
        fontSize: 16,
        color: theme.colors.text,
        marginTop: 10,
    },
    inputText: {
        fontSize: 16,
        color: theme.colors.text,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    linkLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    link: {
        flexDirection: 'row',
    },
    button: {
        marginTop: 20,
        borderRadius: 50,
        overflow: 'hidden',
    },
    buttonLabel: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.white,
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
    },
}));

function LoginFragment({ navigation, setIndex }) {
    const { styles, theme } = useStyles(stylesheet);
    const inputPassword = useRef(null);
    const username = useRef('');
    const password = useRef('');

    const login = useCallback(async () => {
        try {
            if (!username.current || !password.current) {
                Toast.show('用户名和密码不能为空');
                return;
            }
            let result = await UserAPI.login(username.current, password.current);
            await encryptStorage.setStringAsync('token', result.data.token);
            await encryptStorage.setIntAsync('tokenTime', Date.now());
            navigation.goBack();
        } catch (_) {}
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '登录',
        });
    }, [navigation]);

    return (
        <>
            <Text style={styles.inputLabel}>用户名 / 昵称</Text>
            <TextInput style={styles.inputText} placeholder="请输入用户名" autoComplete="name" returnKeyType="next"
                onChangeText={(text) => username.current = text} onSubmitEditing={(e) => inputPassword.current.focus()} />
            <Text style={styles.inputLabel}>密码</Text>
            <TextInput ref={inputPassword} style={styles.inputText} placeholder="请输入密码" autoComplete="password" secureTextEntry={true} returnKeyType="done"
                onChangeText={(text) => password.current = text} />
            <View style={styles.linkLayout}>
                <View style={styles.link}>
                    <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.text }}>没有账号？去</Text>
                    <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.primary }} onPress={() => setIndex(1)}>注册</Text>
                </View>
                <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.primary }} onPress={() => setIndex(2)}>找回密码</Text>
            </View>
            <TouchableHighlight style={styles.button} onPress={login}>
                <Text style={styles.buttonLabel}>登录</Text>
            </TouchableHighlight>
        </>
    );
}

function RegisterFragment({ navigation, setIndex }) {
    const { styles, theme } = useStyles(stylesheet);
    const inputPassword = useRef(null);
    const inputRepeatedPassword = useRef(null);
    const inputInviter = useRef(null);
    const username = useRef('');
    const password = useRef('');
    const repeatedPassword = useRef('');
    const inviter = useRef('');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '注册',
        });
    }, [navigation]);

    const register = useCallback(async () => {
        try {
            if (!username.current || !password.current) {
                Toast.show('用户名和密码不能为空');
                return;
            }
            if (!inviter.current) {
                Toast.show('请填写邀请人，可以在群内捉管理邀请你哦～');
                return;
            }
            if (password.current !== repeatedPassword.current) {
                Toast.show('两次输入的密码不一致');
                return;
            }
            await UserAPI.register(username.current, password.current, inviter.current);
            Toast.show('注册成功，请登录～');
            setIndex(0);
        } catch (_) {}
    }, [setIndex]);

    return (
        <>
            <Text style={styles.inputLabel}>用户名</Text>
            <TextInput style={styles.inputText} placeholder="请输入用户名" returnKeyType="next"
                onChangeText={(text) => username.current = text} onSubmitEditing={(e) => inputPassword.current.focus()} />
            <Text style={styles.inputLabel}>密码</Text>
            <TextInput ref={inputPassword} style={styles.inputText} placeholder="请输入密码" secureTextEntry={true} returnKeyType="next"
                onChangeText={(text) => password.current = text} onSubmitEditing={(e) => inputRepeatedPassword.current.focus()} />
            <Text style={styles.inputLabel}>确认密码</Text>
            <TextInput ref={inputRepeatedPassword} style={styles.inputText} placeholder="请再输入一次密码" secureTextEntry={true} returnKeyType="next"
                onChangeText={(text) => repeatedPassword.current = text} onSubmitEditing={(e) => inputInviter.current.focus()} />
            <Text style={styles.inputLabel}>邀请人</Text>
            <TextInput ref={inputInviter} style={styles.inputText} placeholder="请输入邀请人名称" returnKeyType="done"
                onChangeText={(text) => inviter.current = text} />
            <View style={styles.linkLayout}>
                <View style={styles.link}>
                    <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.text }}>已有账号？去</Text>
                    <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.primary }} onPress={() => setIndex(0)}>登录</Text>
                </View>
            </View>
            <TouchableHighlight style={styles.button} onPress={register}>
                <Text style={styles.buttonLabel}>注册</Text>
            </TouchableHighlight>
        </>
    );
}

function ForgetFragment({ navigation, setIndex }) {
    const { styles, theme } = useStyles(stylesheet);
    const inputPassword = useRef(null);
    const inputRepeatedPassword = useRef(null);
    const username = useRef('');
    const password = useRef('');
    const repeatedPassword = useRef('');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '忘记密码',
        });
    }, [navigation]);

    const forget = useCallback(async () => {
        try {
            if (!username.current || !password.current) {
                Toast.show('用户名和密码不能为空');
                return;
            }
            if (password.current !== repeatedPassword.current) {
                Toast.show('两次输入的密码不一致');
                return;
            }
            await UserAPI.forgetPassword(username.current, password.current);
            Toast.show('已提交修改密码申请，快去群里找邀请人审核吧～');
            setIndex(0);
        } catch (_) {}
    }, [setIndex]);

    return (
        <>
            <Text style={styles.inputLabel}>用户名</Text>
            <TextInput style={styles.inputText} placeholder="请输入用户名" returnKeyType="next"
                onChangeText={(text) => username.current = text} onSubmitEditing={(e) => inputPassword.current.focus()} />
            <Text style={styles.inputLabel}>新密码</Text>
            <TextInput ref={inputPassword} style={styles.inputText} placeholder="请输入新密码" secureTextEntry={true} returnKeyType="next"
                onChangeText={(text) => password.current = text} onSubmitEditing={(e) => inputRepeatedPassword.current.focus()} />
            <Text style={styles.inputLabel}>确认新密码</Text>
            <TextInput ref={inputRepeatedPassword} style={styles.inputText} placeholder="请再输入一次新密码" secureTextEntry={true} returnKeyType="done"
                onChangeText={(text) => repeatedPassword.current = text} />
            <View style={styles.linkLayout}>
                <View style={styles.link} />
                <Text style={{ fontSize: theme.sizes.lg, color: theme.colors.primary }} onPress={() => setIndex(0)}>返回登录</Text>
            </View>
            <TouchableHighlight style={styles.button} onPress={forget}>
                <Text style={styles.buttonLabel}>提交申请</Text>
            </TouchableHighlight>
        </>
    );
}

export default function LoginPage({ navigation, route }) {
    const { styles, theme } = useStyles(stylesheet);
    const [index, setIndex] = useState(0);

    const PageFragment = [LoginFragment, RegisterFragment, ForgetFragment][index];

    return (
        <ScrollView style={[theme.components.Container, styles.container]}
            overScrollMode="never" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Image style={[styles.logo, styles.logoBrand]} source={require('../assets/images/logo.webp')} />
                <Image style={[styles.logo, styles.logoTitle]} source={require('../assets/images/logo_title.webp')} />
            </View>
            <View style={styles.fragment}>
                <PageFragment navigation={navigation} setIndex={setIndex} />
            </View>
        </ScrollView>
    );
}
