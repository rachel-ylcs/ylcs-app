import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function SettingsPage({ navigation }) {
    const { theme } = useStyles();

    return (
        <View style={theme.components.CenterContainer}>
            <Text>设置</Text>
        </View>
    );
}
