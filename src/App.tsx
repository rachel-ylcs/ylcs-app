import React from 'react';
import { StyleSheet, Image, StatusBar } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { navs, routes } from './router';
import './store'; // init MMKV
import './theme'; // init themes

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NavBar(): JSX.Element {
    const { theme } = useStyles();

    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: theme.colors.accent,
            tabBarInactiveTintColor: theme.colors.primary,
        }}>
            {navs.map((item) => (
                <Tab.Screen key={item.name} name={item.name} options={{
                    title: item.title,
                    tabBarLabel: item.title,
                    tabBarIcon: ({ focused, size }) => {
                        let icon = focused ? item.icon.active : item.icon.inactive;
                        return <Image style={{ width: size, height: size }} source={icon} />;
                    },
                    headerTitle: item.title,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        shadowOpacity: 0,
                        elevation: 0,
                    },
                }} component={item.component} />
            ))}
        </Tab.Navigator>
    );
}

function App(): JSX.Element {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={StyleSheet.absoluteFill}>
                <BottomSheetModalProvider>
                    <NavigationContainer>
                        {/* HACK 让android端默认打开app就是全面屏, android端还得加个splash */}
                        <StatusBar animated={true} barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                        <Stack.Navigator>
                            <Stack.Screen name="Home" options={{ headerShown: false }} component={NavBar} />
                            {routes.map((item) => (
                                <Stack.Screen key={item.name} name={item.name} options={item.option} getId={item.getId} component={item.component} />
                            ))}
                        </Stack.Navigator>
                    </NavigationContainer>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

export default App;
