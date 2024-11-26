import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import TopicCommentIcon from '../assets/images/topic_comment.svg';

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 3,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardTitle: {
        width: '100%',
        fontSize: 14,
        color: 'black',
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    cardPoster: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    cardAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    cardName: {
        flex: 1,
        fontSize: 12,
        color: 'gray',
    },
    cardNum: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 4,
    },
});

export default function TopicCard({ content, cardWidth }) {
    const navigation = useNavigation();

    const imageWidth = cardWidth - styles.card.margin * 2;

    return (
        <TouchableWithoutFeedback onPress={() => {
            navigation.navigate('TopicDetail', { id: content.tid });
        }}>
            <View style={styles.card}>
                {content.pic && <FastImage
                    style={{ width: imageWidth, height: imageWidth / 3 * 4 }}
                    source={{ uri: content.picUrl }}
                    defaultSource={require('../assets/images/placeholder_loading.webp')} />}
                <Text style={styles.cardTitle}>{content.title}</Text>
                <View style={styles.cardPoster}>
                    <FastImage style={styles.cardAvatar} source={{ uri: content.avatar }} />
                    <Text style={styles.cardName}>{content.name}</Text>
                    <TopicCommentIcon height={16} width={16} />
                    <Text style={styles.cardNum}>{content.commentNum}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
