import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WeiboHeader from './WeiboHeader';
import Html from './Html';
import NineGridImage from './NineGridImage';
import TopicLikeIcon from '../assets/images/topic_like.svg';
import TopicCommentIcon from '../assets/images/topic_comment.svg';
import TopicRepostIcon from '../assets/images/topic_repost.svg';

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
    images: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerIcon: {
        width: 16,
        height: 16,
    },
    footerText: {
        color: 'gray',
        fontSize: 12,
        marginLeft: 8,
    },
});

export default function WeiboCard({ content, preview, width }) {
    const navigation = useNavigation();

    // 处理下微博富文本中不标准的 HTML 标签
    let richText = content.text.replace("src='//", "src='https://");
    if (richText.includes('<image')) {
        richText = richText.replace('<image', '<img style="width: 1rem;height: 1rem"');
    }

    return (
        <TouchableWithoutFeedback onPress={preview ? () => {
            navigation.navigate('WeiboDetail', { content });
        } : undefined}>
            <View style={styles.container}>
                <WeiboHeader style={styles.header} user={content.user} time={content.time} />
                <Html
                    contentWidth={width}
                    source={{ html: richText }} />
                <NineGridImage
                    style={styles.images}
                    width={width - 20}
                    itemGap={3}
                    data={content.pictures}
                    onItemPress={(item, index) => {
                        navigation.navigate('Preview', {
                            images: content.pictures,
                            index: index,
                        });
                    }} />
                <View style={styles.footer}>
                    <View style={styles.footerItem}>
                        <TopicLikeIcon height={styles.footerIcon.height} width={styles.footerIcon.width} />
                        <Text style={styles.footerText}>{content.likeNum}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <TopicCommentIcon height={styles.footerIcon.height} width={styles.footerIcon.width} />
                        <Text style={styles.footerText}>{content.commentNum}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <TopicRepostIcon height={styles.footerIcon.height} width={styles.footerIcon.width} />
                        <Text style={styles.footerText}>{content.repostNum}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
