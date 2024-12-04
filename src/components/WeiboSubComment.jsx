import React from 'react';
import { StyleSheet, View } from 'react-native';
import WeiboHeader from './WeiboHeader';
import Html from './Html';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        borderTopColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    header: {
        marginBottom: 10,
    },
});

export default function WeiboSubComment({ style, content, width }) {
    return (
        <View style={[styles.container, style]}>
            <WeiboHeader style={styles.header} user={content.user} time={content.time} />
            <Html
                contentWidth={width}
                source={{ html: content.text }} />
        </View>
    );
}
