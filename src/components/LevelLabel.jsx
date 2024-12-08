import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { LEVELS_TABLE } from '../api/ylcs';

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    background: {
        height: '100%',
        aspectRatio: 21 / 8,
        resizeMode: 'contain',
    },
    name: {
        position: 'absolute',
        width: '100%',
        bottom: '5%',
        textAlign: 'center',
        fontSize: 12,
        color: 'black',
    },
});

export default function LevelLabel({ style, level, customTitle }) {
    return (
        <View style={[styles.container, style]}>
            <Image style={styles.background} source={level?.background ?? LEVELS_TABLE[0].background} />
            <Text style={styles.name}>{(customTitle || level?.name) ?? LEVELS_TABLE[0].name}</Text>
        </View>
    );
}
