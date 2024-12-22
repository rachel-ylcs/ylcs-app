package love.yinlin.ylcs.data.music

/**
 * 歌词信息
 */
data class LyricsInfo(
    var engineName: String,
    var name: String,
    var available: Boolean
)

typealias LyricsInfoList = List<LyricsInfo>
