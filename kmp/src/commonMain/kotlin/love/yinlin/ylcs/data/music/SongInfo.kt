package love.yinlin.ylcs.data.music

import com.yinlin.rachel.model.engine.LineLyricsEngine
import com.yinlin.rachel.tool.parseJsonObject
import com.yinlin.rachel.tool.writeJson
import love.yinlin.ylcs.utils.Paths
import love.yinlin.ylcs.utils.exists
import love.yinlin.ylcs.utils.join

/**
 * 歌曲信息
 */
data class SongInfo (
    /**
     * 版本号
     */
    var version: String,
    /**
     * 作者
     */
    var author: String,
    /**
     * 编号
     */
    var id: String,
    /**
     * 歌名
     */
    var name: String,
    /**
     * 歌手
     */
    var singer: String,
    /**
     * 词作
     */
    var lyricist: String,
    /**
     * 曲作
     */
    var composer: String,
    /**
     * 专辑
     */
    var album: String,
    /**
     * 是否有动态背景
     */
    var bgd: Boolean,
    /**
     * 是否有MV
     */
    var video: Boolean,
    /**
     * 副歌点
     */
    val chorus: ChorusList = mutableListOf(),
    /**
     * 歌词引擎
     */
    val lyrics: LyricsFileMap = mutableMapOf(),
    /**
     * LRC歌词
     * 延迟加载属性
     */
    var lrcData: LrcData? = null,
) {
    val isCorrect: Boolean get() {
        if (id.isEmpty()) return false
        if (!audioPath.exists()) return false
        if (!recordPath.exists()) return false
        if (!bgsPath.exists()) return false
        if (bgd && !bgdPath.exists()) return false
        if (video && !videoPath.exists()) return false
        if (lyrics.isEmpty()) return false
        val lineEngine = lyrics[LineLyricsEngine.NAME]
        return !(lineEngine.isNullOrEmpty() || !lineEngine.contains(LineLyricsEngine.DEFAULT_RES))
    }

    val infoPath get() = Paths.musicPath.join(id + MusicRes.INFO_NAME)
    val audioPath get() = Paths.musicPath.join(id + MusicRes.AUDIO_NAME)
    val recordPath get() = Paths.musicPath.join(id + MusicRes.RECORD_NAME)
    val defaultLrcPath get() = Paths.musicPath.join(id + MusicRes.DEFAULT_LRC_NAME)
    val videoPath get() = Paths.musicPath.join(id + MusicRes.VIDEO_NAME)
    val bgsPath get() = Paths.musicPath.join(id + MusicRes.BGS_NAME)
    val bgdPath get() = Paths.musicPath.join(id + MusicRes.BGD_NAME)

    fun customPath(name: String) = Paths.musicPath.join(id + name)

    fun rewrite() {
        val json = this.parseJsonObject
        json.remove("lrcData")
        infoPath.writeJson(json)
    }
}

typealias SongMap = MutableMap<String, SongInfo>
typealias ChorusList = List<Long>
typealias LyricsFileMap = Map<String, MutableList<String>>
