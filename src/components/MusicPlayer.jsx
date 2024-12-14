import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const stylesheet = createStyleSheet((theme, runtime) => ({
    container: {
        ...theme.components.CenterContainer,
        backgroundColor: 'black',
    },
    tip: {
        color: 'white',
    },
}));

export default function MusicPlayer() {
    const { styles, theme } = useStyles(stylesheet);

    return (
        <View style={[theme.components.Container, styles.container]}>
            <Text style={styles.tip}>听歌功能正在开发中, 敬请期待</Text>
        </View>
    );
}
