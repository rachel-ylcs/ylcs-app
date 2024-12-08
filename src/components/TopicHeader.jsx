import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LevelLabel from './LevelLabel';
import MoreIcon from '../assets/images/more.svg';

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
        color: 'steelblue',
        fontSize: 14,
    },
    subtitle: {
        color: 'darkgray',
        fontSize: 12,
    },
    level: {
        height: 40,
        marginRight: 10,
    },
});

export default function TopicHeader({ style, content, onMorePress }) {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => navigation.push('User', { uid: content.uid })}>
            <View style={[styles.container, style]}>
                <FastImage style={styles.avatar} source={{ uri: content.avatar }} />
                <View style={styles.layout1}>
                    <Text style={styles.title}>{content.name}</Text>
                    <View style={styles.layout2}>
                        <Text style={styles.subtitle}>{content.ts}</Text>
                        <Text style={styles.subtitle}>{content.location}</Text>
                    </View>
                </View>
                <LevelLabel style={styles.level} level={content.level} customTitle={content.label} />
                <TouchableWithoutFeedback onPress={onMorePress}>
                    <MoreIcon width={32} height={32} fill="gray" />
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
}
