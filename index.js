import 'react-native-url-polyfill/auto';
import { AppRegistry, Platform, LogBox, Text, TextInput } from 'react-native';
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

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === 'web') {
    AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
}
