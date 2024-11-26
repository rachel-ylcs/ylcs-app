import React from 'react';
import { View, Text, Button } from 'react-native';

export default function MePage({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>小银子</Text>
            <Button title="设置" onPress={(e) => navigation.navigate('Settings')} />
        </View>
    );
}
