import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopicHeader from './TopicHeader';
import NineGridImage from './NineGridImage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
    },
    header: {
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 28,
        textAlignVertical: 'center',
        color: 'black',
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: 'black',
        marginBottom: 10,
    },
});

export default function TopicCard({ content, width }) {
    const navigation = useNavigation();

    const images = useMemo(() => content.pics?.map((pic) => ({
        url: content.picUrl(pic),
    })), [content]);

    return (
        <View style={styles.container}>
            <TopicHeader style={styles.header} content={content} onMorePress={(e) => {}} />
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.content}>{content.content}</Text>
            <NineGridImage
                width={width - 20}
                itemGap={3}
                data={images}
                onItemPress={(item, index) => {
                    navigation.navigate('Preview', {
                        images: images,
                        index: index,
                    });
                }} />
        </View>
    );
}
