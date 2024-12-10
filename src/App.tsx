import React from 'react';
import { StyleSheet, Text, Image, StatusBar, StyleProp, TextStyle, View } from 'react-native';
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
    const watermarkStyle: StyleProp<TextStyle> = {
        width: '100%',
        zIndex: 9999,
        transform: [{ rotate: '-45deg' }, { translateY: -25 }],
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    };

    return (
        <>
            <SafeAreaProvider>
                <GestureHandlerRootView style={StyleSheet.absoluteFill}>
                    <BottomSheetModalProvider>
                        <NavigationContainer>
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
            <View style={[StyleSheet.absoluteFill, { flexDirection: 'column', justifyContent: 'space-around' }]} pointerEvents="none">
                <Text style={watermarkStyle}>{'正在开发中\n不代表最终品质\n仅供银临茶舍项目组内部测试使用'}</Text>
                <Text style={watermarkStyle}>{'正在开发中\n不代表最终品质\n仅供银临茶舍项目组内部测试使用'}</Text>
                <Text style={watermarkStyle}>{'正在开发中\n不代表最终品质\n仅供银临茶舍项目组内部测试使用'}</Text>
            </View>
        </>
    );
}

export default App;
