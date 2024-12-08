import 'react-native-url-polyfill/auto';
import { AppRegistry, Platform, LogBox, Text, TextInput, Alert } from 'react-native';
import prompt from 'react-native-prompt-android';
import { name as appName } from './app.json';
import App from './src/App';

// See https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

if (Platform.OS === 'ios') {
    TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false });
    Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });
}
if (Platform.OS === 'android') {
    Alert.prompt = (title, message, callbackOrButtons, type, defaultValue, keyboardType, options) =>
        prompt(title, message, callbackOrButtons, {
            type,
            defaultValue,
            keyboardType,
            ...options,
        });
}

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === 'web') {
    AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
}
