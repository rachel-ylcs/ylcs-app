import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { displayName, version, versionCode } from '../../app.json';
import RightArrowIcon from '../assets/images/right_arrow.svg';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: 'black',
        marginTop: 25,
    },
    version: {
        fontSize: 18,
        marginTop: 5,
    },
    list: {
        flex: 1,
        width: '100%',
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    itemKey: {
        fontSize: 16,
        color: 'black',
        marginHorizontal: 10,
    },
    itemValue: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
    },
    valueText: {
        fontSize: 16,
        color: 'black',
    },
    itemSeparator: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#bbb',
    },
    footer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    links: {
        flexDirection: 'row',
    },
    link: {
        fontSize: 12,
        color: 'steelblue',
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
    studio: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: StatusBar.currentHeight + 10,
        right: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function StudioModal({ modalVisible, setModalVisible }) {
    const { theme } = useStyles();

    return (
        <Modal transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={theme.components.CenterContainer}>
                <Image style={styles.studio} source={require('../assets/images/studio.webp')} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 36, color: 'gray' }}>×</Text>
            </TouchableOpacity>
        </Modal>
    );
}

export default function AboutPage({ navigation, route }) {
    const { theme } = useStyles();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={theme.components.Container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../assets/images/logo.webp')} />
                <Text style={styles.title}>{displayName}</Text>
                <Text style={styles.version}>v{version} ({versionCode})</Text>
            </View>
            <View style={styles.list}>
                <View style={styles.itemSeparator} />
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>检查更新</Text>
                        <View style={styles.itemValue}>
                            <Text style={styles.valueText}>有新版本</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.itemSeparator} />
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>更新日志</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <View style={styles.itemSeparator} />
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>小银子体验改进计划</Text>
                        <View style={styles.itemValue}>
                            <Text style={styles.valueText}>未加入</Text>
                            <RightArrowIcon width={20} height={20} fill="gray" />
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.itemSeparator} />
                <TouchableHighlight onPress={() => {}}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>提交反馈</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <View style={styles.itemSeparator} />
                <TouchableHighlight onPress={() => setModalVisible(true)}>
                    <View style={styles.item}>
                        <Text style={styles.itemKey}>茶舍的小伙伴们</Text>
                        <RightArrowIcon width={20} height={20} fill="gray" />
                    </View>
                </TouchableHighlight>
                <View style={styles.itemSeparator} />
            </View>
            <View style={styles.footer}>
                <View style={styles.links}>
                    <Text style={styles.link}>《服务条款》</Text>
                    <Text style={styles.link}>《隐私政策》</Text>
                    <Text style={styles.link}>《权限使用声明》</Text>
                </View>
                <Text style={styles.text}>ICP备案号：xxxxxxxxxx</Text>
                <Text style={styles.text}>{'银临茶舍项目组 版权所有\nCopyright © 2024 ylcs. All Rights Reserved.'}</Text>
            </View>
            <StudioModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
}
