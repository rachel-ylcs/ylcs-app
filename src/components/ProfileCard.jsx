import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import FastImage from 'react-native-fast-image';
import LevelLabel from './LevelLabel';

const styles = StyleSheet.create({
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
    layout1: {
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
    layout2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    data: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    dataNum: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    dataLabel: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
    },
});

export default function ProfileCard({ user, onPress }) {
    const { theme } = useStyles();

    return (
        <>
            <View style={styles.backgroundWrapper}>
                <FastImage style={styles.backgroundWall} source={{ uri: user?.wall }} />
            </View>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[theme.components.Card, styles.profileCard]}>
                    <View style={styles.layout1}>
                        <FastImage style={styles.avatar} source={{ uri: user?.avatar }} />
                        <Text style={styles.nickname}>{user?.name ?? '点击登录'}</Text>
                        <LevelLabel level={user?.level} customTitle={user?.label} />
                    </View>
                    <Text style={styles.signature}>{user?.signature ?? '泸沽烟水里的过客…'}</Text>
                    <View style={styles.layout2}>
                        <View style={styles.data}>
                            <Text style={styles.dataNum}>{String(user?.level.level ?? 1)}</Text>
                            <Text style={styles.dataLabel}>等级</Text>
                        </View>
                        <View style={styles.data}>
                            <Text style={styles.dataNum}>{String(user?.coin ?? 0)}</Text>
                            <Text style={styles.dataLabel}>银币</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
