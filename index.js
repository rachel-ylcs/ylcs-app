import { AppRegistry, Platform, Text, TextInput } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

if (Platform.OS === 'ios') {
    TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false });
    Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });
}

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === 'web') {
    AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
}
