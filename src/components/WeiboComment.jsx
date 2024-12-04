import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WeiboHeader from './WeiboHeader';
import Html from './Html';
import NineGridImage from './NineGridImage';
import WeiboSubComment from './WeiboSubComment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        paddingBottom: 0,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    header: {
        marginBottom: 10,
    },
    images: {
        marginTop: 10,
    },
    replies: {
        marginLeft: 40,
        marginTop: 10,
    },
});

export default function WeiboComment({ style, content, width }) {
    const navigation = useNavigation();
    const images = content.pic ? [content.pic] : [];

    return (
        <View style={[styles.container, style]}>
            <WeiboHeader style={styles.header} user={content.user} time={content.time} />
            <Html
                contentWidth={width}
                source={{ html: content.text }} />
            <NineGridImage
                style={styles.images}
                width={width - 20}
                itemGap={3}
                data={images}
                onItemPress={(item, index) => {
                    navigation.navigate('Preview', {
                        images: images,
                        index: index,
                    });
                }} />
            <View style={styles.replies}>
                {content.replies?.map((reply, index) => (
                    <WeiboSubComment
                        key={index}
                        content={reply}
                        width={width - 60} />
                ))}
            </View>
        </View>
    );
}
