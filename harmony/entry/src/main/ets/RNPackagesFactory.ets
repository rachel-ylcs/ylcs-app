import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import { PermissionsPackage } from '@react-native-oh-tpl/react-native-permissions/ts';
import { FsPackage } from '@react-native-ohos/react-native-fs/ts';
import { RNMMKVStoragePackage } from '@react-native-oh-tpl/react-native-mmkv-storage';
import { RNUnistylesPackage } from '@react-native-oh-tpl/react-native-unistyles/ts';
import { GestureHandlerPackage } from '@react-native-oh-tpl/react-native-gesture-handler/ts';
import { ReanimatedPackage } from '@react-native-oh-tpl/react-native-reanimated/ts';
import { SafeAreaViewPackage } from '@react-native-oh-tpl/react-native-safe-area-context/ts';
import { ViewPagerPackage } from '@react-native-oh-tpl/react-native-pager-view/ts';
import { SvgPackage } from '@react-native-oh-tpl/react-native-svg/ts';
import { FastImagePackage } from '@react-native-oh-tpl/react-native-fast-image/ts';
import { WebViewPackage } from '@react-native-oh-tpl/react-native-webview/ts';
import { RTNCameraKitPackage } from "@react-native-oh-tpl/react-native-camera-kit/ts";
import { ImagePickerViewPackage } from '@react-native-oh-tpl/react-native-image-picker/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
    return [
        new FsPackage(ctx),
        new PermissionsPackage(ctx),
        new RNMMKVStoragePackage(ctx),
        new RNUnistylesPackage(ctx),
        new GestureHandlerPackage(ctx),
        new ReanimatedPackage(ctx),
        new SafeAreaViewPackage(ctx),
        new ViewPagerPackage(ctx),
        new SvgPackage(ctx),
        new FastImagePackage(ctx),
        new WebViewPackage(ctx),
        new RTNCameraKitPackage(ctx),
        new ImagePickerViewPackage(ctx),
    ];
}
