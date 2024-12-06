import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Modal, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import LoadingIndicator from '../components/LoadingIndicator';
import TopicCard from '../components/TopicCard';
import TopicComment from '../components/TopicComment';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { UserAPI } from '../api/ylcs';
import GiveCoinIcon from '../assets/images/give_coin.svg';
import SendIcon from '../assets/images/send.svg';

const styles = StyleSheet.create({
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
    const [modalVisible, setModalVisible] = useState(false);
    const inputComment = useRef(null);
    const [comment, setComment] = useState('');
    const topicId = route.params.id;

    const requestData = useCallback(() => {
        UserAPI.getTopic(topicId)
            .then((value) => setData(value.data))
            .catch(console.error);
    }, [topicId]);

    const postComment = useNeedAuth(() => {
        if (comment.trim() === '') {
            Toast.show('评论内容不能为空');
            return;
        }
        UserAPI.postComment(topicId, comment)
            .then((value) => {
                Toast.show('评论成功');
                setComment('');
                setModalVisible(false);
                requestData();
            })
            .catch((e) => {});
    }, [topicId]);

    const giveCoin = useNeedAuth(useCallback((coinNum) => {
        UserAPI.giveCoin(data.uid, data.tid, coinNum)
            .then((value) => Toast.show('投币成功'))
            .catch((e) => {});
    }, [data]));

    useEffect(() => {
        if (modalVisible && inputComment.current) {
            setTimeout(() => {
                inputComment.current.focus();
            }, 100);
        }
    }, [modalVisible]);

    useEffect(() => {
        requestData();
    }, [requestData]);

    return (
        <View style={theme.components.Container}>
            {data ? (
                <>
                    <FlashList
                        estimatedItemSize={100}
                        data={data.comments}
                        renderItem={({item}) => <TopicComment content={item} width={width} />}
                        keyExtractor={(item, index) => index}
                        // onEndReachedThreshold={0.25}
                        // onEndReached={data !== null ? loadMore : undefined}
                        ListHeaderComponent={<TopicCard content={data} width={width} />}
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
                <LoadingIndicator text="加载帖子中..." />
            )}
        </View>
    );
}
