import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect } from '@react-navigation/native';

const stylesheet = createStyleSheet((theme, runtime) => ({
    container: {
        backgroundColor: 'black',
    },
}));

export default function NewsPage({ navigation }) {
    const { styles, theme } = useStyles(stylesheet);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'transparent',
                borderTopWidth: 0,
            },
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content', true);

            return () => StatusBar.setBarStyle('dark-content', true);
        }, [])
    );

    return (
        <View style={[theme.components.CenterContainer, styles.container]}>
            <Text style={{ color: 'white' }}>听歌功能正在开发中, 敬请期待</Text>
        </View>
    );
}
