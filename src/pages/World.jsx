import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import RightArrowIcon from '../assets/images/right_arrow.svg';
import GalleryIcon from '../assets/images/gallery.svg';

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: 'black',
        marginHorizontal: 20,
    },
});

export default function WorldPage({ navigation }) {
    const { theme } = useStyles();

    return (
        <ScrollView style={theme.components.Container} overScrollMode="never" showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <TouchableHighlight onPress={() => {
                    navigation.navigate('Gallery');
                }}>
                    <View style={styles.item}>
                        <GalleryIcon width={24} height={24} fill="steelblue" />
                        <Text style={styles.itemText}>美图</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.section}>
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={[styles.itemText, { marginLeft: 44 }]}>更多玩法敬请期待…</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
}
