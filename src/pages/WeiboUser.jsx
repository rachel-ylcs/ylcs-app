import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function WeiboUserPage({ navigation, route }) {
    const { theme } = useStyles();

    return (
        <View style={theme.components.CenterContainer}>
            <Text>微博用户</Text>
        </View>
    );
}
