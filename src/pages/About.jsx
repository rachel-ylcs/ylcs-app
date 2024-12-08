import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useStyles } from 'react-native-unistyles';

const styles = StyleSheet.create({
    studio: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default function AboutPage({ navigation, route }) {
    const { theme } = useStyles();

    return (
        <View style={theme.components.CenterContainer}>
            <Image style={styles.studio} source={require('../assets/images/studio.webp')} />
        </View>
    );
}
