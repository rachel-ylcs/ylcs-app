import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MasonryFlashList } from '@shopify/flash-list';
import Breadcrumb from '../components/Breadcrumb';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import AlbumCard from '../components/AlbumCard';
import { useGalleryStore } from '../store/Gallery';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    breadcrumb: {
        width: '100%',
    },
});

export default function GalleryPage({ navigation }) {
    const { width } = useWindowDimensions();
    const { data, refreshing, error, refresh } = useGalleryStore();
    const [path, setPath] = useState(['相册']);

    useFocusEffect(
        React.useCallback(() => {
            const listener = BackHandler.addEventListener('hardwareBackPress', () => {
                if (path.length > 1) {
                    setPath(path.slice(0, -1));
                    return true;
                }
                return false;
            });

            return () => listener.remove();
        }, [path])
    );

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const folder = useMemo(() => {
        return path.slice(1).reduce((data, name, index) => data?.folders?.[name], data);
    }, [data, path]);

    return (
        <View style={styles.container}>
            <Breadcrumb style={styles.breadcrumb} path={path} setPath={setPath} />
            <MasonryFlashList
                numColumns={2}
                estimatedItemSize={200}
                data={folder?.folders ? Object.entries(folder.folders) : folder?.thumbnails?.map((thumbnail, index) => ({ index, thumbnail }))}
                renderItem={({ item }) => {
                    if (folder.folders) {
                        const [name, _] = item;
                        return (
                            <AlbumCard title={name} cardWidth={width / 2} onPress={() => {
                                setPath([...path, name]);
                            }} />
                        );
                    } else {
                        const { index, thumbnail } = item;
                        return (
                            <AlbumCard cover={thumbnail} title={index} author={folder.author} cardWidth={width / 2} onPress={() => {
                                navigation.navigate('Preview', {
                                    images: folder.files,
                                    index: index,
                                });
                            }} />
                        );
                    }
                }}
                keyExtractor={(item, index) => Array.isArray(item) ? item[0] : item.index}
                onRefresh={data !== null ? refresh : undefined}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false} />
            {!data && (
                !error ? (
                    <LoadingIndicator text="加载美图中..." />
                ) : (
                    <OfflineIndicator onRetry={refresh} />
                )
            )}
        </View>
    );
}
