import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function TopicDetailPage({ navigation, route }) {
    const { theme } = useStyles();

    return (
        <View style={theme.components.CenterContainer}>
            <Text>话题详情页</Text>
        </View>
    );
}
