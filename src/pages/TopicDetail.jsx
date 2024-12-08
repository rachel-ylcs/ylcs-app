import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Modal, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import TopicCard from '../components/TopicCard';
import TopicComment from '../components/TopicComment';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { UserAPI } from '../api/ylcs';
import GiveCoinIcon from '../assets/images/give_coin.svg';
import SendIcon from '../assets/images/send.svg';

const styles = StyleSheet.create({
    commentListHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    commentNum: {
        fontSize: 14,
        color: 'black',
    },
    commentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    commentTip: {
        flex: 1,
        fontSize: 16,
    },
    commentModal: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: 300,
        padding: 10,
        backgroundColor: 'white',
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    commentInput: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    commentSend: {
        marginTop: 10,
    },
});

export default function TopicDetailPage({ navigation, route }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const inputComment = useRef(null);
    const [comment, setComment] = useState('');

    const topicId = route.params.id;

    const requestData = useCallback(() => {
        setError(false);
        UserAPI.getTopic(topicId)
            .then((result) => setData(result.data))
            .catch((e) => setError(true));
    }, [topicId]);

    const postComment = useNeedAuth(useCallback(() => {
        if (comment.trim() === '') {
            Toast.show('评论内容不能为空');
            return;
        }
        UserAPI.postComment(topicId, comment)
            .then((result) => {
                Toast.show('评论成功');
                setComment('');
                setModalVisible(false);
                requestData();
            })
            .catch((e) => {});
    }, [topicId, comment, requestData]));

    const giveCoin = useNeedAuth(useCallback((coinNum) => {
        UserAPI.giveCoin(data.uid, data.tid, coinNum)
            .then((result) => Toast.show('投币成功'))
            .catch((e) => {});
    }, [data]));

    useEffect(() => {
        if (modalVisible && inputComment.current) {
            setTimeout(() => {
                inputComment.current.focus();
            }, 100);
        }
    }, [modalVisible]);

    useEffect(requestData, [requestData]);

    return (
        <View style={theme.components.Container}>
            {data ? (
                <>
                    <FlashList
                        estimatedItemSize={100}
                        data={data.comments}
                        renderItem={({item}) => <TopicComment content={item} width={width} onMorePress={() => {}} />}
                        keyExtractor={(item, index) => index}
                        // onEndReachedThreshold={0.25}
                        // onEndReached={data !== null ? loadMore : undefined}
                        ListHeaderComponent={(
                            <>
                                <TopicCard content={data} width={width} onMorePress={() => {}} />
                                <View style={styles.commentListHeader}>
                                    <Text style={styles.commentNum}>{data.comments.length > 0 ? `共 ${data.comments.length} 条评论` : '还没有评论哦，快来留下你的足迹吧~'}</Text>
                                </View>
                            </>
                        )}
                        // ListFooterComponent={data !== null && loading && <LoadMoreItem />}
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false} />
                    <TouchableWithoutFeedback onPress={(e) => setModalVisible(true)}>
                        <View style={styles.commentBox}>
                            <Text style={styles.commentTip}>快来留下你的足迹~</Text>
                            <GiveCoinIcon width={30} height={30} onPress={(e) => giveCoin(1)} />
                        </View>
                    </TouchableWithoutFeedback>
                    <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={StyleSheet.absoluteFill} />
                        </TouchableWithoutFeedback>
                        <View style={styles.commentModal}>
                            <TextInput style={styles.commentInput} multiline={true} placeholder="请输入评论内容"
                                ref={inputComment} value={comment} onChangeText={setComment} />
                            <SendIcon style={styles.commentSend} width={30} height={30} onPress={postComment} />
                        </View>
                    </Modal>
                </>
            ) : (
                !error ? (
                    <LoadingIndicator text="加载帖子中..." />
                ) : (
                    <OfflineIndicator onRetry={requestData} />
                )
            )}
        </View>
    );
}
