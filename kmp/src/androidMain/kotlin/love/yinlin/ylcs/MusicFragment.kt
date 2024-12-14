package love.yinlin.ylcs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.fragment.app.Fragment

// HACK 由于react-native-screens对视图进行了缓存, 不能直接使用ComposeView, 在该库对compose提供官方支持前必须使用Fragment
// 详见 https://github.com/react-native-community/discussions-and-proposals/issues/446
// 以及 https://github.com/software-mansion/react-native-screens/issues/2098
class MusicFragment : Fragment() {

    private lateinit var root: ComposeView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        super.onCreateView(inflater, container, savedInstanceState)
        root = ComposeView(requireContext()).apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
            setContent {
                App()
            }
        }
        return root
    }
}
