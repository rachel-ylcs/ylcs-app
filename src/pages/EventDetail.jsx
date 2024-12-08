import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, useWindowDimensions, Linking } from 'react-native';
import Toast from 'react-native-simple-toast';
import NineGridImage from '../components/NineGridImage';
import { createActivityStore, ActivityProvider, useActivityStore } from '../store/Activities';
import { Links } from '../utils/util';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    links: {
        flexDirection: 'row',
    },
    link: {
        flex: 1,
        resizeMode: 'contain',
        marginHorizontal: 5,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: 'black',
        marginVertical: 10,
    },
});

function EventDetailPage({ navigation, route }) {
    const { width } = useWindowDimensions();
    const { data, error, refresh } = useActivityStore((state) => state);

    const timestamp = route.params.ts;

    const links = useMemo(() => {
        const links = [];
        if (data?.showstart) {
            links.push({
                name: '秀动',
                url: Links.showstart(data.showstart),
                image: require('../assets/images/showstart_logo.webp'),
            });
        }
        if (data?.damai) {
            links.push({
                name: '大麦',
                url: Links.damai(data.damai),
                image: require('../assets/images/damai_logo.webp'),
            });
        }
        if (data?.maoyan) {
            links.push({
                name: '猫眼',
                url: Links.maoyan(data.maoyan),
                image: require('../assets/images/maoyan_logo.webp'),
            });
        }
        while (links.length < 3) {
            links.push({ name: `empty-${links.length}` });
        }
        return links;
    }, [data]);

    const images = useMemo(() => data?.pics?.map((pic) => ({
        url: data.picUrl(pic),
    })), [data]);

    useEffect(() => {
        refresh(timestamp);
    }, [refresh, timestamp]);

    useEffect(() => {
        if (data?.title) {
            navigation.setOptions({ title: data.title });
        }
    }, [navigation, data?.title]);

    return (
        <View style={styles.container}>
            <View style={styles.links}>
                {links.map((link) => link.url ? (
                    <TouchableWithoutFeedback key={link.name} onPress={async () => {
                        try {
                            await Linking.openURL(link.url);
                        } catch (e) {
                            Toast.show(`未安装${link.name}`);
                        }
                    }}>
                        <Image style={styles.link} source={link.image} />
                    </TouchableWithoutFeedback>
                ) : (
                    <View key={link.name} style={styles.link} />
                ))}
            </View>
            <Text style={styles.content}>{data?.content}</Text>
            <NineGridImage
                width={width - 20}
                itemGap={3}
                data={images}
                onItemPress={(item, index) => {
                    navigation.navigate('Preview', {
                        images: images,
                        index: index,
                    });
                }} />
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
