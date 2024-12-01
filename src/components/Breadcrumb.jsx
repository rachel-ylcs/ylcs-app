import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    separator: {
        fontSize: 16,
        color: 'gray',
        paddingHorizontal: 2,
    },
    item: {
        flexDirection: 'row',
        padding: 5,
    },
    itemLabel: {
        fontSize: 16,
        color: 'black',
    },
    itemLabelActive: {
        color: 'steelblue',
    },
});

export default function Breadcrumb({ style, path, setPath }) {
    return (
        <View style={[styles.container, style]}>
            {path.map((item, index) => (
                <Fragment key={index}>
                    {index > 0 && <Text style={styles.separator}>&gt;</Text>}
                    <Pressable style={styles.item} onPress={() => setPath(path.slice(0, index + 1))} android_ripple={{
                        color: 'lightgray',
                    }}>
                        <Text style={[styles.itemLabel, index === path.length - 1 && styles.itemLabelActive]}>{item}</Text>
                    </Pressable>
                </Fragment>
            ))}
        </View>
    );
}
