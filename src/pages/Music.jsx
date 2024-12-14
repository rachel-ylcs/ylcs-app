import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MusicPlayer from '../components/MusicPlayer';

export default function MusicPage({ navigation }) {
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'transparent',
                borderTopWidth: 0,
            },
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content', true);

            return () => StatusBar.setBarStyle('dark-content', true);
        }, [])
    );

    return <MusicPlayer />;
}
