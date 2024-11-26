import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
});

export default function LoadMoreItem({ style }) {
    return (
        <View style={[styles.container, style]}>
            <Text>正在加载...</Text>
        </View>
    );
}
