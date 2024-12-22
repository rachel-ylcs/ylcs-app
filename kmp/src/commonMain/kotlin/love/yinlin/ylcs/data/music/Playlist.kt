package love.yinlin.ylcs.data.music

/**
 * 播放列表中的歌曲
 */
data class PlaylistItem(
    var id: String,
    var name: String,
    var singer: String,
)

/**
 * 播放列表
 */
typealias Playlist = MutableList<PlaylistItem>
typealias PlaylistMap = MutableMap<String, Playlist>
