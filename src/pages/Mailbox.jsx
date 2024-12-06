import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function ProfilePage({ navigation, route }) {
    const { theme } = useStyles();

    return (
        <View style={theme.components.CenterContainer}>
            <Text>邮箱</Text>
        </View>
    );
}
