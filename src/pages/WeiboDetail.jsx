import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import WeiboCard from '../components/WeiboCard';
import WeiboComment from '../components/WeiboComment';
import WeiboAPI from '../api/weibo';

export default function WeiboDetailPage({ navigation, route }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();
    const [data, setData] = useState(null);
    const content = route.params.content;

    useEffect(() => {
        WeiboAPI.getDetails(content.id)
            .then(setData)
            .catch((e) => {});
    }, [content.id]);

    return (
        <View style={theme.components.Container}>
            <FlashList
                estimatedItemSize={100}
                data={data}
                renderItem={({item}) => <WeiboComment content={item} width={width} />}
                keyExtractor={(item, index) => index}
                // onEndReachedThreshold={0.25}
                // onEndReached={data !== null ? loadMore : undefined}
                ListHeaderComponent={<WeiboCard content={content} width={width} />}
                // ListFooterComponent={data !== null && loading && <LoadMoreItem />}
                overScrollMode="never"
                showsVerticalScrollIndicator={false} />
        </View>
    );
}
