import React from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navs, routes } from './router';
import './store'; // init MMKV
import './theme'; // init themes

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NavBar(): JSX.Element {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: 'purple',
            tabBarInactiveTintColor: 'steelblue',
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
                }} component={item.component} />
            ))}
        </Tab.Navigator>
    );
}

function App(): JSX.Element {
    return (
        <SafeAreaProvider>
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
        </SafeAreaProvider>
    );
}

export default App;
