import React from 'react';
import { useStyles } from 'react-native-unistyles';
import { WebView } from 'react-native-webview';

export default function WebBrowserPage({ navigation, route }) {
    const { theme } = useStyles();
    const { url } = route.params;

    return (
        <WebView
            style={theme.components.Container}
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
