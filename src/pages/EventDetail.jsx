import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { createActivityStore, ActivityProvider, useActivityStore } from '../store/Activities';

function EventDetailPage({ navigation, route }) {
    const { theme } = useStyles();
    const { data, error, refresh } = useActivityStore((state) => state);

    useEffect(() => {
        refresh(route.params.ts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={theme.components.Container}>
            <Text>{data?.title}</Text>
            <Text>{data?.content}</Text>
            <Text>{data?.showstart}</Text>
            <Text>{data?.damai}</Text>
            <Text>{data?.maoyan}</Text>
        </View>
    );
}

export default function EventDetailPageWrapper(props) {
    return (
        <ActivityProvider createStore={createActivityStore}>
            <EventDetailPage {...props} />
        </ActivityProvider>
    );
}
