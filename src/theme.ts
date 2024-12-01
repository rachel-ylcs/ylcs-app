import { UnistylesRegistry } from 'react-native-unistyles';

const lightTheme = {
    colors: {
        primary: 'steelblue',
        secondary: 'salmon',
        accent: 'purple',
        text: 'black',
        secondaryText: 'gray',

        icon: 'dimgray',
        border: 'gray',

        success: 'green',
        failed: 'red',
        info: 'black',
        warn: 'orange',
        error: 'red',

        white: 'white',
    },
    sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 20,
        xxxl: 24,
    },
    components: {
        Container: {
            flex: 1,
            // backgroundColor: '#f6f6f6',
        },
        CenterContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#f6f6f6',
        },
        Section: {
            flex: 1,
            padding: 10,
            backgroundColor: 'white',
        },
        Card: {
            flex: 1,
            padding: 10,
            margin: 5,
            backgroundColor: 'white',
            borderRadius: 10,
        },
    },
};

type AppThemes = {
    light: typeof lightTheme,
}

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry
    .addThemes({
        light: lightTheme,
    })
    .addConfig({
        initialTheme: 'light',
    });
