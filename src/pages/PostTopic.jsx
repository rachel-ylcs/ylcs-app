import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { View, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';
import { useTopicStores } from '../store/Topic';
import { UserAPI } from '../api/ylcs';
import AddImageIcon from '../assets/images/add_image.svg';

const MAX_UPLOAD_IMAGE = 9;

const stylesheet = createStyleSheet((theme, runtime) => ({
    headerActions: {
        flexDirection: 'row',
    },
    postAction: {
        fontSize: theme.sizes.xl,
        color: 'steelblue',
    },
    container: {
        padding: 10,
        backgroundColor: 'white',
    },
    inputText: {
        fontSize: 16,
        color: theme.colors.text,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    multiInputText: {
        minHeight: 200,
        maxHeight: 300,
        textAlignVertical: 'top',
    },
    images: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        gap: 5,
        marginVertical: 20,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
    },
    thumbnail: {
        width: '100%',
        aspectRatio: 1,
    },
}));

export default function PostTopicPage({ navigation, route }) {
    const { styles, theme } = useStyles(stylesheet);
    const { refresh } = useTopicStores.latest(useShallow((state) => ({ refresh: state.refresh })));
    const inputContent = useRef(null);
    const title = useRef('');
    const content = useRef('');
    const [uploadAssets, setUploadAssets] = useState([]);

    const postTopic = useCallback(() => {
        if (!title.current.trim() || !content.current.trim()) {
            Toast.show('标题和正文不能为空');
            return;
        }
        const files = uploadAssets.map((item) => ({
            uri: item.uri,
            name: item.fileName,
            type: item.type,
        }));
        UserAPI.postTopic(title.current, content.current, files)
            .then((result) => {
                Toast.show('发布成功');
                refresh();
                navigation.goBack();
            })
            .catch((e) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, uploadAssets]);

    const onImagePress = useCallback(async (index) => {
        // 点击图片删除
        if (index < uploadAssets.length) {
            setUploadAssets(uploadAssets.filter((_, i) => i !== index));
            return;
        }
        // 点击加号上传
        if (uploadAssets.length >= MAX_UPLOAD_IMAGE) {
            Toast.show(`最多上传${MAX_UPLOAD_IMAGE}张图片`);
            return;
        }
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: MAX_UPLOAD_IMAGE - uploadAssets.length,
        });
        if (result.didCancel) {
            return;
        }
        if (result.errorCode) {
            Toast.show(result.errorMessage);
            return;
        }
        if (result.assets) {
            setUploadAssets(uploadAssets.concat(result.assets));
        }
    }, [uploadAssets]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={postTopic}>
                        <Text style={styles.postAction}>发布</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, postTopic]);

    let colData = [];
    for (let col = 0; col < 3; col++) {
        let rowData = [];
        for (let i = col; i < uploadAssets.length; i += 3) {
            rowData.push(uploadAssets[i]);
        }
        colData.push(rowData);
    }
    if (uploadAssets.length < MAX_UPLOAD_IMAGE) {
        colData[uploadAssets.length % 3].push({});
    }

    return (
        <ScrollView style={[theme.components.Container, styles.container]}
            overScrollMode="never" showsVerticalScrollIndicator={false}>
            <TextInput style={styles.inputText} placeholder="请输入标题" returnKeyType="next"
                onChangeText={(text) => title.current = text} onSubmitEditing={(e) => inputContent.current.focus()} />
            <TextInput ref={inputContent} style={[styles.inputText, styles.multiInputText]} placeholder="请输入内容" multiline
                onChangeText={(text) => content.current = text} />
            <View style={styles.grid}>
                {colData.map((rowData, col) => (
                    <View style={styles.column} key={col}>
                        {rowData.map((item, index) => (
                            <TouchableWithoutFeedback key={index} onPress={() => onImagePress(index * 3 + col)}>
                                {item.uri ? (
                                    <FastImage style={styles.thumbnail} source={{ uri: item.uri }} />
                                ) : (
                                    <AddImageIcon style={styles.thumbnail} />
                                )}
                            </TouchableWithoutFeedback>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
