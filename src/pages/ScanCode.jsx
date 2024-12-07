import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Linking, Platform } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { QRscanner, QRreader } from 'react-native-qr-decode-image-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import ScanFlashlightOffIcon from '../assets/images/scan_flashlight_off.svg';
import ScanFlashlightOnIcon from '../assets/images/scan_flashlight_on.svg';
import ScanAlbumIcon from '../assets/images/scan_album.svg';

const styles = StyleSheet.create({
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#0000004D',
    },
});

export default function ScanCodePage({ navigation }) {
    const { theme } = useStyles();
    const [flashMode, setFlashMode] = useState(false);

    const onCodeScan = useCallback((code) => {
        navigation.goBack();
        // 临时解决方案, 待APP支持deep link后删掉
        if (code.value.startsWith('rachel://')) {
            let url = new URL(code.value);
            if (url.pathname === '/openProfile') {
                let uid = url.searchParams.get('uid');
                navigation.navigate('User', { uid });
            }
            return;
        }
        try {
            Linking.openURL(code.value);
        } catch (error) {
            Toast.show('暂不支持识别该二维码');
        }
    }, [navigation]);

    const pickImage = useCallback(async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (result.didCancel) {
            return;
        } else if (result.errorCode) {
            Toast.show(result.errorMessage);
            return;
        }
        let file = result.assets[0].uri;
        // 鸿蒙只是封了一层@kit.ScanKit, 没有屏蔽参数和返回值的差异, 所以需要特殊处理一下
        if (Platform.OS === 'harmony') {
            file = { uri: file };
        }
        try {
            let scanResult = await QRreader(file);
            if (Platform.OS === 'harmony') {
                scanResult = scanResult?.[0]?.originalValue;
            }
            onCodeScan({ type: 'unknown', value: scanResult });
        } catch (error) {
            Toast.show('未识别到二维码');
        }
    }, [onCodeScan]);

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTintColor: 'white',
            headerTitleStyle: { color: 'white' },
            headerBackTitleStyle: { color: 'white' },
        });
    }, [navigation]);

    return (
        <View style={theme.components.Container}>
            <QRscanner
                isRepeatScan={false}
                onRead={onCodeScan}
                cornerColor="steelblue"
                scanBarColor="steelblue"
                hintText="请将二维码放入框内"
                hintTextPosition={150}
                renderBottomView={() => {
                    return (
                        <>
                            <TouchableWithoutFeedback onPress={() => setFlashMode(!flashMode)}>
                                {flashMode ? (
                                    <ScanFlashlightOnIcon width={40} height={40} fill="white" />
                                ) : (
                                    <ScanFlashlightOffIcon width={40} height={40} fill="white" />
                                )}
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => pickImage()}>
                                <ScanAlbumIcon width={40} height={40} fill="white" />
                            </TouchableWithoutFeedback>
                        </>
                    );
                }}
                bottomViewStyle={styles.bottomView}
                flashMode={flashMode}
                finderY={50}
            />
        </View>
    );
}
