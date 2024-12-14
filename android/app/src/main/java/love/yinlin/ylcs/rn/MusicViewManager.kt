package love.yinlin.ylcs.rn

import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import love.yinlin.ylcs.MusicFragment

class MusicViewManager(
    private val reactContext: ReactApplicationContext
) : ViewGroupManager<FrameLayout>() {

    companion object {
        private const val REACT_CLASS = "RNMusicView"
        private const val COMMAND_CREATE = 1
    }

    private val fragment = MusicFragment()

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) =
        FrameLayout(reactContext)

    override fun getCommandsMap() = mapOf("create" to COMMAND_CREATE)

    override fun receiveCommand(root: FrameLayout, commandId: String, args: ReadableArray?) {
        super.receiveCommand(root, commandId, args)
        val reactNativeViewId = requireNotNull(args).getInt(0)

        when (commandId.toInt()) {
            COMMAND_CREATE -> createFragment(root, reactNativeViewId)
        }
    }

    private fun createFragment(root: FrameLayout, reactNativeViewId: Int) {
        val parentView = root.findViewById<ViewGroup>(reactNativeViewId)
        setupLayout(root, parentView)

        val activity = reactContext.currentActivity as FragmentActivity
        activity.supportFragmentManager
            .beginTransaction()
            .replace(reactNativeViewId, fragment, reactNativeViewId.toString())
            .commit()
    }

    private fun setupLayout(root: View, view: View) {
        Choreographer.getInstance().postFrameCallback(object: Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                manuallyLayoutChildren(root, view)
                view.viewTreeObserver.dispatchOnGlobalLayout()
                Choreographer.getInstance().postFrameCallback(this)
            }
        })
    }

    private fun manuallyLayoutChildren(root: View, view: View) {
        view.measure(
            View.MeasureSpec.makeMeasureSpec(root.measuredWidth, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(root.measuredHeight, View.MeasureSpec.EXACTLY))
        view.layout(root.left, root.top, root.measuredWidth, root.measuredHeight)
    }
}
