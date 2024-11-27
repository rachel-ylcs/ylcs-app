import React, { useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { View, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { TabView } from 'react-native-tab-view';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-simple-toast';
import TabBar from '../components/TabBar';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import LoadMoreItem from '../components/LoadMoreItem';
import WeiboCard from '../components/WeiboCard';
import { useWeiboStore, useChaohuaStore } from '../store/News';
import EditIcon from '../assets/images/edit.svg';

function Tab({ navigation, tab }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();
    const { data, refreshing, loading, error, refresh, loadMore } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        tab === 'weibo' ? useWeiboStore(useShallow((state) => ({
            data: state.data,
            refreshing: state.refreshing,
            loading: undefined,
            error: state.error,
            refresh: state.refresh,
            loadMore: undefined,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        }))) : useChaohuaStore(useShallow((state) => ({
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
            <FlashList
                ref={list}
                onScroll={({ nativeEvent }) => {
                    scrollY.current = nativeEvent.contentOffset.y;
                }}
                onMomentumScrollEnd={({ nativeEvent }) => {
                    scrollY.current = nativeEvent.contentOffset.y;
                }}
                estimatedItemSize={100}
                data={data}
                renderItem={({item}) => <WeiboCard content={item} cardWidth={width} />}
                keyExtractor={(item, index) => `${item.user.userId}_${item.id}`}
                onRefresh={data !== null ? refresh : undefined}
                refreshing={refreshing}
                onEndReachedThreshold={0.25}
                onEndReached={data !== null ? loadMore : undefined}
                ListFooterComponent={data !== null && loading && <LoadMoreItem />}
                overScrollMode="never"
                showsVerticalScrollIndicator={false} />
            {!data && (
                !error ? (
                    <LoadingIndicator text="加载资讯中..." />
                ) : (
                    <OfflineIndicator onRetry={refresh} />
                )
            )}
        </View>
    );
}

export default function NewsPage({ navigation }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();
    const tarBar = useRef(null);
    const [index, setIndex] = useState(0);
    const routes = [
        { key: 'weibo', title: '微博' },
        { key: 'chaohua', title: '超话' },
    ];

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                return tarBar.current;
            },
            headerRight: () => (
                <TouchableWithoutFeedback onPress={() => Toast.show('点击了编辑微博关注按钮')}>
                    <EditIcon style={{ marginRight: theme.sizes.xxxl }}
                        width={theme.sizes.xxxl} height={theme.sizes.xxxl} fill={theme.colors.icon} />
                </TouchableWithoutFeedback>
            ),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, tarBar.current]);

    return (
        <TabView
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={(({ route }) => <Tab navigation={navigation} tab={route.key} />)}
            renderTabBar={(props) => {
                tarBar.current = (<TabBar {...props} onIndexChange={setIndex} />);
                return null;
            }}
            initialLayout={{ width }}
            lazy />
    );
}
