import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Alert } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import { createMailboxStore, MailboxProvider, useMailboxStore } from '../store/Mailbox';
import { UserAPI, MailType } from '../api/ylcs';

const styles = StyleSheet.create({
    emptyMailbox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
        color: 'black',
    },
    mail: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    mailBadge: {
        width: 10,
        height: '100%',
        backgroundColor: 'steelblue',
    },
    mailBadgeConfirm: {
        backgroundColor: 'green',
    },
    mailBadgeDecision: {
        backgroundColor: 'purple',
    },
    mailLayout1: {
        flex: 1,
        padding: 10,
    },
    mailLayout2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    mailTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'steelblue',
    },
    mailTime: {
        fontSize: 14,
        color: 'black',
    },
    mailContent: {
        fontSize: 14,
        color: 'black',
    },
    mailHasRead: {
        color: 'gray',
    },
});

/**
 * @param {{ content: import('../api/ylcs').Mail }} content
 */
function MailItem({ content, refresh }) {
    const action = useCallback(() => {
        if (content.processed) {
            Alert.alert(content.title, content.content, [
                { text: '关闭', style: 'cancel' },
            ], {
                cancelable: true,
            });
        } else if (content.type === MailType.INFO || content.type === MailType.CONFIRM) {
            Alert.alert(content.title, content.content, [
                { text: content.type === MailType.INFO ? '好的' : '确认', onPress: () => {
                    UserAPI.processMail(content.mid, true)
                        .then(() => {
                            if (content.type === MailType.CONFIRM) {
                                Toast.show('已确认');
                            }
                            refresh();
                        })
                        .catch((e) => {});
                } },
            ], {
                cancelable: true,
            });
        } else if (content.type === MailType.DECISION) {
            Alert.alert(content.title, content.content, [
                { text: '拒绝', style: 'cancel', onPress: () => {
                    UserAPI.processMail(content.mid, false)
                        .then(() => {
                            Toast.show('已拒绝');
                            refresh();
                        })
                        .catch((e) => {});
                } },
                { text: '同意', onPress: () => {
                    UserAPI.processMail(content.mid, true)
                        .then(() => {
                            Toast.show('已同意');
                            refresh();
                        })
                        .catch((e) => {});
                } },
            ], {
                cancelable: true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const badgeStyle = content.type === MailType.CONFIRM ? styles.mailBadgeConfirm : content.type === MailType.DECISION ? styles.mailBadgeDecision : null;

    return (
        <TouchableHighlight onPress={action}>
            <View style={styles.mail}>
                <View style={[styles.mailBadge, badgeStyle]} />
                <View style={styles.mailLayout1}>
                    <View style={styles.mailLayout2}>
                        <Text style={[styles.mailTitle, content.processed && styles.mailHasRead]}>{content.title}</Text>
                        <Text style={[styles.mailTime, content.processed && styles.mailHasRead]}>{content.ts}</Text>
                    </View>
                    <Text style={[styles.mailContent, content.processed && styles.mailHasRead]}
                        numberOfLines={1}>{content.content}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

function MailboxPage({ navigation, route }) {
    const { theme } = useStyles();
    const { data, refreshing, error, refresh } = useMailboxStore((state) => state);

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={theme.components.Container}>
            <FlashList
                estimatedItemSize={100}
                data={data}
                renderItem={({item}) => <MailItem content={item} refresh={refresh} />}
                keyExtractor={(item, index) => `${item.uid}_${item.mid}`}
                onRefresh={data !== null ? refresh : undefined}
                refreshing={refreshing}
                overScrollMode="never"
                showsVerticalScrollIndicator={false} />
            {!data ? (
                !error ? (
                    <LoadingIndicator text="加载邮件中..." />
                ) : (
                    <OfflineIndicator onRetry={refresh} />
                )
            ) : (
                data.length === 0 && <Text style={styles.emptyMailbox}>你还没有收到邮件哦~</Text>
            )}
        </View>
    );
}

export default function MailboxPageWrapper(props) {
    return (
        <MailboxProvider createStore={createMailboxStore}>
            <MailboxPage {...props} />
        </MailboxProvider>
    );
}
