import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import AutoSizeImage from './FastAutoSizeImage';

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 3,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardTitle: {
        width: '100%',
        fontSize: 12,
        color: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    cardAuthor: {
        width: '100%',
        fontSize: 12,
        color: 'gray',
        paddingHorizontal: 8,
        paddingBottom: 4,
    },
});

export default function AlbumCard({ cover, title, author, cardWidth, onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.card}>
                <AutoSizeImage
                    length={cardWidth - styles.card.margin * 2}
                    autoHeight={true}
                    source={cover ? { uri: cover } : require('../assets/images/album_cover.webp')}
                    defaultSource={require('../assets/images/placeholder_loading.webp')} />
                <Text style={styles.cardTitle}>{title}</Text>
                {author && <Text style={styles.cardAuthor}>{author}</Text>}
            </View>
        </TouchableWithoutFeedback>
    );
}
