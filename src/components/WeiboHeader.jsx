import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { formatDateTime } from '../utils/util';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    layout1: {
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginLeft: 10,
    },
    layout2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        color: 'orangered',
        fontSize: 14,
    },
    subtitle: {
        color: 'darkgray',
        fontSize: 12,
    },
});

export default function WeiboHeader({ style, user, time }) {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('WeiboUser', { user })}>
            <View style={[styles.container, style]}>
                <FastImage style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.layout1}>
                    <Text style={styles.title}>{user.name}</Text>
                    <View style={styles.layout2}>
                        <Text style={styles.subtitle}>{formatDateTime(time)}</Text>
                        <Text style={styles.subtitle}>{user.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
