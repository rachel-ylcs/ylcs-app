import { UnistylesRegistry } from 'react-native-unistyles';

const lightTheme = {
    colors: {
        primary: 'steelblue',
        secondary: 'salmon',
        accent: 'purple',
        text: 'black',
        secondaryText: 'gray',
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
        Card: {

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
