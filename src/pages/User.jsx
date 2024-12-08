import React, { useState, useEffect, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { MasonryFlashList } from '@shopify/flash-list';
import ProfileCard from '../components/ProfileCard';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineIndicator from '../components/OfflineIndicator';
import TopicPreviewCard from '../components/TopicPreviewCard';
import { UserAPI } from '../api/ylcs';

export default function UserPage({ navigation, route }) {
    const { width } = useWindowDimensions();
    const { theme } = useStyles();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    const userId = route.params.uid;

    const requestData = useCallback(() => {
        setError(false);
        UserAPI.getProfile(userId)
            .then((result) => setData(result.data))
            .catch((e) => setError(true));
    }, [userId]);

    useEffect(requestData, [requestData]);

    return (
        <View style={theme.components.Container}>
            <MasonryFlashList
                numColumns={2}
                estimatedItemSize={200}
                data={data?.topics}
                renderItem={({ item }) => <TopicPreviewCard content={item} width={width / 2} />}
                keyExtractor={(item, index) => item.tid}
                ListHeaderComponent={data && <ProfileCard user={data} />}
                overScrollMode="never"
                showsVerticalScrollIndicator={false} />
            {!data && (
                !error ? (
                    <LoadingIndicator text="加载资料卡中..." />
                ) : (
                    <OfflineIndicator onRetry={requestData} />
                )
            )}
        </View>
    );
}
