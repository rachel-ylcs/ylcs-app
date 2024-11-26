import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OfflineIcon from '../assets/images/offline.svg';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
    },
    button: {
        width: 80,
        height: 30,
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    buttonText: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        lineHeight: 30,
        fontSize: 12,
        color: 'white',
        backgroundColor: 'steelblue',
    },
});

export default function OfflineIndicator({ style, onRetry }) {
    return (
        <View style={[styles.container, style]}>
            <OfflineIcon width={80} height={80} fill="steelblue" />
            <Text style={styles.text}>请检查您的网络连接</Text>
            <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onRetry}>
                <Text style={styles.buttonText}>重试</Text>
            </TouchableOpacity>
        </View>
    );
}
