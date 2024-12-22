package love.yinlin.ylcs.data.neteasecloud

data class CloudMusic(
    /**
     * 音乐 ID
     */
    val id: String,
    /**
     * 名称
     */
    val name: String,
    /**
     * 歌手
     */
    val singer: String,
    /**
     * 时长
     */
    val time: String,
    /**
     * 封面
     */
    val pic: String,
    /**
     * 歌词
     */
    val lyrics: String,
    /**
     * MP3 下载链接
     */
    val mp3Url: String,
)

typealias CloudMusicList = List<CloudMusic>
