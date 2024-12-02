import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Toast from 'react-native-simple-toast';
import { UserAPI } from '../api/ylcs';
import { storage as encryptStorage } from '../store';

const stylesheet = createStyleSheet((theme, runtime) => ({
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

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '登录',
        });
    }, [navigation]);

    const login = useCallback(async () => {
        try {
            if (!username.current || !password.current) {
                Toast.show('用户名或密码不能为空');
                return;
            }
            let result = await UserAPI.login(username.current, password.current);
            await encryptStorage.setStringAsync('token', result.data.token);
            navigation.goBack();
        } catch (_) {}
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

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '注册',
        });
    }, [navigation]);

    return (
        <>
            <Text>注册</Text>
        </>
    );
}

function ForgetFragment({ navigation, setIndex }) {
    const { styles, theme } = useStyles(stylesheet);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '忘记密码',
        });
    }, [navigation]);

    return (
        <>
            <Text>忘记密码</Text>
        </>
    );
}

export default function LoginPage({ navigation, route }) {
    const { styles, theme } = useStyles(stylesheet);
    const [index, setIndex] = useState(0);

    const PageFragment = [LoginFragment, RegisterFragment, ForgetFragment][index];

    return (
        <View style={[theme.components.Container, { backgroundColor: theme.colors.white }]}>
            <View style={styles.header}>
                <Image style={[styles.logo, styles.logoBrand]} source={require('../assets/images/logo.webp')} />
                <Image style={[styles.logo, styles.logoTitle]} source={require('../assets/images/logo_title.webp')} />
            </View>
            <View style={styles.fragment}>
                <PageFragment navigation={navigation} setIndex={setIndex} />
            </View>
        </View>
    );
}
