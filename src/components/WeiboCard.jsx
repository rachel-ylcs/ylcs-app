import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Html from './Html';
import NineGridImage from './NineGridImage';
import { formatDate } from '../utils/util';
import TopicLikeIcon from '../assets/images/topic_like.svg';
import TopicCommentIcon from '../assets/images/topic_comment.svg';
import TopicRepostIcon from '../assets/images/topic_repost.svg';

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 10,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    cardHeaderLayout1: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        marginLeft: 10,
    },
    cardHeaderLayout2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: 'orangered',
        fontSize: 15,
    },
    cardSubtitle: {
        color: 'darkgray',
        fontSize: 13,
    },
    cardImages: {
        marginTop: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    cardFooterItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardFooterIcon: {
        width: 14,
        height: 14,
    },
    cardFooterText: {
        color: 'gray',
        fontSize: 11,
        marginLeft: 8,
    },
});

export default function WeiboCard({ content, cardWidth }) {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => {
            navigation.navigate('WeiboDetail', { id: content.id });
        }}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <FastImage style={styles.cardAvatar} source={{ uri: content.user.avatar }} />
                    <View style={styles.cardHeaderLayout1}>
                        <Text style={styles.cardTitle}>{content.user.name}</Text>
                        <View style={styles.cardHeaderLayout2}>
                            <Text style={styles.cardSubtitle}>{formatDate(content.time)}</Text>
                            <Text style={styles.cardSubtitle}>{content.user.location}</Text>
                        </View>
                    </View>
                </View>
                <Html
                    contentWidth={cardWidth}
                    source={{ html: content.text }} />
                <NineGridImage
                    style={styles.cardImages}
                    width={cardWidth - 30}
                    itemGap={3}
                    data={content.pictures}
                    onItemPress={(item, index) => {
                        navigation.navigate('Preview', {
                            images: content.pictures,
                            index: index,
                        });
                    }} />
                <View style={styles.cardFooter}>
                    <View style={styles.cardFooterItem}>
                        <TopicLikeIcon height={styles.cardFooterIcon.height} width={styles.cardFooterIcon.width} />
                        <Text style={styles.cardFooterText}>{content.likeNum}</Text>
                    </View>
                    <View style={styles.cardFooterItem}>
                        <TopicCommentIcon height={styles.cardFooterIcon.height} width={styles.cardFooterIcon.width} />
                        <Text style={styles.cardFooterText}>{content.commentNum}</Text>
                    </View>
                    <View style={styles.cardFooterItem}>
                        <TopicRepostIcon height={styles.cardFooterIcon.height} width={styles.cardFooterIcon.width} />
                        <Text style={styles.cardFooterText}>{content.repostNum}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
