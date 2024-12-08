/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { StyleSheet, View, Text, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { TabView, TabBar } from 'react-native-tab-view';
import { TabBarItemLabel } from 'react-native-tab-view/src/TabBarItemLabel';
import { MasonryFlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import PopupMenu from '../components/PopupMenu';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import LoadMoreItem from '../components/LoadMoreItem';
import TopicPreviewCard from '../components/TopicPreviewCard';
import { useNeedAuth } from '../hooks/useNeedAuth';
import { useTopicStores } from '../store/Topic';
import SearchIcon from '../assets/images/search.svg';
import AddIcon from '../assets/images/add.svg';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    search: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
    },
    searchIcon: {
        marginVertical: 4,
    },
    searchInput: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 8,
    },
    tabBar: {
        backgroundColor: 'white',
    },
    tabBarContainer: {
        // justifyContent: 'center',
    },
    tab: {
        width: 'auto',
        minHeight: 0,
        padding: 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 16,
        color: 'dimgray',
        margin: 0,
    },
    tabLabelActive: {
        fontWeight: '600',
        transform: [{ scale: 1.05 }],
    },
    tabIndicator: {
        bottom: 3,
        width: 0.25,
        height: 3,
        backgroundColor: 'steelblue',
    },
});

function Tab({ navigation, tab }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();

    if (!(tab in useTopicStores)) {
        return (
            <View style={theme.components.CenterContainer}>
                <Text style={{ fontSize: theme.sizes.xl }}>{tab}</Text>
            </View>
        );
    }

    const { data, refreshing, loading, error, refresh, loadMore } =
        useTopicStores[tab](useShallow((state) => ({
            data: state.data,
            refreshing: state.refreshing,
            loading: state.loading,
            error: state.error,
            refresh: state.refresh,
            loadMore: state.loadMore,
        })));
    const list = useRef(null);
    const scrollY = useRef(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            const isFocused = navigation.isFocused();
            requestAnimationFrame(() => {
                if (isFocused && !e.defaultPrevented) {
                    if (scrollY.current > 0) {
                        list.current?.scrollToOffset({ offset: 0, animated: false });
                        scrollY.current = 0;
                    } else {
                        refresh();
                    }
                }
            });
        });

        return () => {
            unsubscribe();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    return (
        <View style={theme.components.Container}>
            <MasonryFlashList
                ref={list}
                onScroll={({ nativeEvent }) => {
                    scrollY.current = nativeEvent.contentOffset.y;
                }}
                onMomentumScrollEnd={({ nativeEvent }) => {
                    scrollY.current = nativeEvent.contentOffset.y;
                }}
                numColumns={2}
                estimatedItemSize={200}
                data={data}
                renderItem={({ item }) => <TopicPreviewCard content={item} width={width / 2} />}
                keyExtractor={(item, index) => item.tid}
                onRefresh={data !== null ? refresh : undefined}
                refreshing={refreshing}
                onEndReachedThreshold={0.25}
                onEndReached={data !== null ? loadMore : undefined}
                ListFooterComponent={data !== null && loading && <LoadMoreItem />}
                overScrollMode="never"
                showsVerticalScrollIndicator={false} />
            {!data && (
                !error ? (
                    <LoadingIndicator text="加载话题中..." />
                ) : (
                    <OfflineIndicator onRetry={refresh} />
                )
            )}
        </View>
    );
}

export default function GalleryPage({ navigation }) {
    const { width } = useWindowDimensions();
    const tabProps = useRef(null);
    const [index, setIndex] = useState(1);
    const [menuVisible, setMenuVisible] = useState(false);

    const routes = [
        { key: 'follows', title: '关注' },
        { key: 'latest', title: '最新' },
        { key: 'hot', title: '热门' },
        { key: 'radio', title: '电台' },
    ];

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                return (
                    <View style={styles.header}>
                        <TouchableWithoutFeedback onPress={() => Toast.show('搜索功能正在开发中')}>
                            <View style={styles.search}>
                                <SearchIcon style={styles.searchIcon} width={18} height={18} fill="dimgray" />
                                <Text style={styles.searchInput}>推荐算法返回的搜索词</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <PopupMenu anchor={(
                            <TouchableWithoutFeedback onPress={() => setMenuVisible(true)}>
                                <AddIcon width={24} height={24} fill="dimgray" />
                            </TouchableWithoutFeedback>
                        )} visible={menuVisible} onClose={() => setMenuVisible(false)}>
                            <PopupMenu.Item text="发图文" onPress={useNeedAuth(() => {
                                setMenuVisible(false);
                                navigation.navigate('PostTopic');
                            })} />
                            <PopupMenu.Item text="发视频" onPress={() => Toast.show('上传视频功能正在开发中')} />
                            <PopupMenu.Item text="直播" onPress={() => Toast.show('直播功能正在开发中')} />
                        </PopupMenu>
                    </View>
                );
            },
            headerShadowVisible: false,
        });
    }, [navigation, tabProps, menuVisible]);

    return (
        <TabView
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={(({ route }) => <Tab navigation={navigation} tab={route.key} />)}
            renderTabBar={(props) => (
                <TabBar {...props}
                    renderLabel={({ route, focused, color }) => (
                        <TabBarItemLabel
                            color={color}
                            label={route.title}
                            labelStyle={[styles.tabLabel, focused && styles.tabLabelActive]} />
                    )}
                    style={styles.tabBar}
                    contentContainerStyle={styles.tabBarContainer}
                    tabStyle={styles.tab}
                    labelStyle={styles.tabLabel}
                    indicatorStyle={styles.tabIndicator}
                    activeColor="steelblue"
                    inactiveColor="dimgray"
                />
            )}
            initialLayout={{ width }}
            lazy />
    );
}
