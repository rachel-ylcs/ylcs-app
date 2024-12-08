import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TopicHeader from './TopicHeader';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 5,
    },
    header: {
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: 'black',
    },
    pinned: {
        color: 'orangered',
    },
});

export default function TopicComment({ style, content, onMorePress }) {
    return (
        <View style={[styles.container, style]}>
            <TopicHeader style={styles.header} content={content} onMorePress={onMorePress} />
            <Text style={styles.content}>
                {content.isTop && <Text style={styles.pinned}>[置顶] </Text>}
                {content.content}
            </Text>
        </View>
    );
}
