import {
    AnyJSBundleProvider,
    ComponentBuilderContext,
    FileJSBundleProvider,
    MetroJSBundleProvider,
    ResourceJSBundleProvider,
    RNApp,
    RNOHErrorDialog,
    RNOHLogger,
    TraceJSBundleProviderDecorator,
    RNOHCoreContext
} from '@rnoh/react-native-openharmony';
import { createRNPackages } from '../RNPackagesFactory';
import { WebView, WEB_VIEW } from '@react-native-oh-tpl/react-native-webview';
import { VisionCameraView } from "@react-native-oh-tpl/react-native-vision-camera";
import { NativeScan } from "@react-native-oh-tpl/qr_decode_image_camera";

const arkTsComponentNames: Array<string> = [
    WEB_VIEW,
    VisionCameraView.NAME
];

@Builder
export function buildCustomRNComponent(ctx: ComponentBuilderContext) {
    if (ctx.componentName === WEB_VIEW) {
        WebView({
            ctx: ctx.rnComponentContext,
            tag: ctx.tag
        });
    } else if (ctx.componentName === VisionCameraView.NAME) {
        VisionCameraView({
            ctx: ctx.rnComponentContext,
            tag: ctx.tag,
        });
    } else if (ctx.componentName === NativeScan.NAME) {
        NativeScan({
            ctx: ctx.rnComponentContext,
            tag: ctx.tag
        })
    }
}

const wrappedCustomRNComponentBuilder = wrapBuilder(buildCustomRNComponent);

@Entry
@Component
struct Index {
    @StorageLink('RNOHCoreContext') private rnohCoreContext?: RNOHCoreContext = undefined;
    @State shouldShow: boolean = false;
    private logger!: RNOHLogger;

    aboutToAppear() {
        this.logger = this.rnohCoreContext!.logger.clone("Index");
        const stopTracing = this.logger.clone("aboutToAppear").startTracing();

        this.shouldShow = true;
        stopTracing();
    }

    onBackPress() {
        // NOTE: this is required since `Ability`'s `onBackPressed` function always
        // terminates or puts the app in the background, but we want Ark to ignore it completely
        // when handled by RN
        this.rnohCoreContext!.dispatchBackPress();
        return true;
    }

    build() {
        Column() {
            if (this.rnohCoreContext && this.shouldShow) {
                if (this.rnohCoreContext?.isDebugModeEnabled) {
                    RNOHErrorDialog({ ctx: this.rnohCoreContext })
                }
                RNApp({
                    rnInstanceConfig: {
                        createRNPackages,
                        enableNDKTextMeasuring: true, // 该项必须为true，用于开启NDK文本测算
                        enableBackgroundExecutor: false,
                        enableCAPIArchitecture: true, // 该项必须为true，用于开启CAPI
                        arkTsComponentNames: arkTsComponentNames
                    },
                    initialProps: {} as Record<string, string>,
                    appKey: "ylcs",
                    wrappedCustomRNComponentBuilder: wrappedCustomRNComponentBuilder,
                    onSetUp: (rnInstance) => {
                        rnInstance.enableFeatureFlag("ENABLE_RN_INSTANCE_CLEAN_UP")
                    },
                    jsBundleProvider: new TraceJSBundleProviderDecorator(
                        new AnyJSBundleProvider([
                            new MetroJSBundleProvider(),
                            // NOTE: to load the bundle from file, place it in
                            // `/data/app/el2/100/base/com.rnoh.tester/files/bundle.harmony.js`
                            // on your device. The path mismatch is due to app sandboxing on HarmonyOS
                            new FileJSBundleProvider('/data/storage/el2/base/files/bundle.harmony.js'),
                            new ResourceJSBundleProvider(this.rnohCoreContext.uiAbilityContext.resourceManager, 'bundle.harmony.hbc'),
                            new ResourceJSBundleProvider(this.rnohCoreContext.uiAbilityContext.resourceManager, 'bundle.harmony.js')
                        ]),
                        this.rnohCoreContext.logger)
                })
            }
        }
        .height('100%')
        .width('100%')
    }
}
