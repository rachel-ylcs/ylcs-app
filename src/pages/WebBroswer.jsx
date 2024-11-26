import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default function WebBrowserPage({ navigation, route }) {
    const { url } = route.params;

    return (
        <WebView
            style={styles.container}
            originWhitelist={['*']}
            source={{ uri: url }}
            onShouldStartLoadWithRequest={(e) => {
                if (e.url.includes('openapp')) {
                    return false;
                }
                return e.url.startsWith('http://') || e.url.startsWith('https://');
            }}
            onNavigationStateChange={(e) => {
                navigation.setOptions({ title: e.title });
            }} />
    );
}
