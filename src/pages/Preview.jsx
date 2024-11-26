import React from 'react';
import ImageView from 'react-native-image-viewing';

// TODO 预览支持下载原图，支持播放视频，将新页面改为悬浮窗
export default function PreviewPage({ navigation, route }) {
    let uris = route.params.images.map((image) => ({
        uri: image.url ?? image,
    }));
    return (
        <ImageView
            images={uris}
            keyExtractor={(image) => image.uri}
            imageIndex={route.params.index}
            visible={true}
            onRequestClose={() => navigation.goBack()}
            swipeToCloseEnabled={false} />
    );
}
