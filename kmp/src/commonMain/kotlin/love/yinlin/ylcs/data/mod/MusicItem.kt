package love.yinlin.ylcs.data.mod;

/**
 * MOD中存放的音乐
 */
data class MusicItem(
    var name: String,
    var version: String,
    val resources: MutableList<String> = ArrayList()
)
