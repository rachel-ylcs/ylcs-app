import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import TopicCommentIcon from '../assets/images/topic_comment.svg';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 3,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    title: {
        width: '100%',
        fontSize: 14,
        color: 'black',
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    poster: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    name: {
        flex: 1,
        fontSize: 12,
        color: 'gray',
    },
    num: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 4,
    },
});

export default function TopicPreviewCard({ content, width }) {
    const navigation = useNavigation();

    const imageWidth = width - styles.container.margin * 2;

    return (
        <TouchableWithoutFeedback onPress={() => {
            navigation.push('TopicDetail', { id: content.tid });
        }}>
            <View style={styles.container}>
                {content.pic && <FastImage
                    style={{ width: imageWidth, height: imageWidth / 3 * 4 }}
                    source={{ uri: content.picUrl }}
                    defaultSource={require('../assets/images/placeholder_loading.webp')} />}
                <Text style={styles.title}>{content.title}</Text>
                <View style={styles.poster}>
                    <FastImage style={styles.avatar} source={{ uri: content.avatar }} />
                    <Text style={styles.name}>{content.name}</Text>
                    <TopicCommentIcon height={16} width={16} />
                    <Text style={styles.num}>{content.commentNum}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
