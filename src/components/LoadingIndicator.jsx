import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

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
});

export default function LoadingIndicator({ style, size = 'large', color = 'steelblue', text }) {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}
