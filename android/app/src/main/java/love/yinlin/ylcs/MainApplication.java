package love.yinlin.ylcs;

import android.app.Application;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.util.DisplayMetrics;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.util.List;

import love.yinlin.ylcs.rn.RachelPackage;
import love.yinlin.ylcs.utils.KVUtil_androidKt;

public class MainApplication extends Application implements ReactApplication {

    public static final int DESIGN_WIDTH_DP = 400;

    private final ReactNativeHost mReactNativeHost =
            new DefaultReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    packages.add(new RachelPackage());
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected boolean isNewArchEnabled() {
                    return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                }

                @Override
                protected Boolean isHermesEnabled() {
                    return BuildConfig.IS_HERMES_ENABLED;
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

        KVUtil_androidKt.initMMKV(this);
    }

    @Override
    public Resources getResources() {
        Resources resources = super.getResources();
        // 防止切小窗时字体缩放被重置, 详见 com.facebook.react.modules.deviceinfo.DeviceInfoModule
        autoAdaptSize(resources);
        return resources;
    }

    public static void autoAdaptSize(Resources resources) {
        DisplayMetrics metrics = resources.getDisplayMetrics();
        Configuration config = new Configuration(resources.getConfiguration());
        config.fontScale = 1.0f;
        // config.densityDpi = metrics.widthPixels * DisplayMetrics.DENSITY_DEFAULT / DESIGN_WIDTH_DP;
        resources.updateConfiguration(config, metrics);
    }
}
