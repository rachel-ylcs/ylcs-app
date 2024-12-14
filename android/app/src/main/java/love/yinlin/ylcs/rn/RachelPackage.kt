package love.yinlin.ylcs.rn

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule

class RachelPackage : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ) = emptyList<NativeModule>()

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ) = listOf(MusicViewManager(reactContext))
}
