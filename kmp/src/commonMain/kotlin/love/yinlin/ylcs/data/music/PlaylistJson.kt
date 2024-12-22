package love.yinlin.ylcs.data.music

/**
 * 播放列表JSON
 */
data class PlaylistJson(
    var name: String,
    val items: MutableList<String>
) {
    constructor(name: String, item: String): this(name, ArrayList<String>()) {
        items += item
    }
}

typealias PlaylistMapJson = MutableMap<String, PlaylistJson>
