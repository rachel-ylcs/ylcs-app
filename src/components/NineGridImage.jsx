import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import AutoSizeImage from './FastAutoSizeImage';

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        flexDirection: 'column',
    },
    thumbnail: {
        width: '100%',
        aspectRatio: 1,
    },
    large: {
        alignItems: 'flex-start',
    },
});

export default function NineGridImage(props) {
    let data = props.data;
    if (!data || data.length === 0) {
        return <View />;
    } else if (data.length === 1) {
        return (
            <View style={[styles.large, props.style]}>
                <TouchableWithoutFeedback
                    onPress={props.onItemPress ? () => props.onItemPress(data[0], 0) : undefined}>
                    <AutoSizeImage
                        length={props.width}
                        source={{ uri: data[0].url }} />
                </TouchableWithoutFeedback>
            </View>
        );
    } else {
        let numColumns = data.length === 2 || data.length === 4 ? 2 : 3;
        let colData = [];
        for (let col = 0; col < numColumns; col++) {
            let rowData = [];
            for (let i = col; i < data.length; i += numColumns) {
                rowData.push(data[i]);
            }
            colData.push(rowData);
        }
        let itemGap = props.itemGap ?? 0;
        return (
            <View style={[styles.grid, { gap: itemGap }, props.style]}>
                {colData.map((rowData, col) => (
                    <View style={[styles.column, { gap: itemGap }]} key={col}>
                        {rowData.map((item, index) => (
                            <TouchableWithoutFeedback
                                onPress={props.onItemPress ? () => props.onItemPress(item, index * numColumns + col) : undefined}
                                key={index}>
                                <FastImage style={styles.thumbnail} source={{ uri: item.url }} />
                            </TouchableWithoutFeedback>
                        ))}
                    </View>
                ))}
            </View>
        );
    }
}
