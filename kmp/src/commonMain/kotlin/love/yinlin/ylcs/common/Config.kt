package love.yinlin.ylcs.common

import love.yinlin.ylcs.data.music.Playlist
import love.yinlin.ylcs.data.music.PlaylistMapJson
import love.yinlin.ylcs.utils.KV
import love.yinlin.ylcs.utils.getJson
import love.yinlin.ylcs.utils.setJson

/**
 * 配置存储(React Native和KMP)
 */
lateinit var storage: KV
/**
 * 数据缓存(React Native)
 */
lateinit var cacheStorage: KV
/**
 * 加密存储(React Native, 存用户信息和Token)
 */
lateinit var encryptStorage: KV

object Config {
    /**
     * 歌单
     */
    var playlists: PlaylistMapJson
        get() = storage.getJson("playlists", mutableMapOf())
        set(value) = storage.setJson("playlists", value)
    /**
     * 当前播放列表
     */
    var cur_playlist: Playlist
        get() = storage.getJson("cur_playlist", mutableListOf())
        set(value) = storage.setJson("cur_playlist", value)
    /**
     * 当前播放歌曲
     */
    var cur_playing: String
        get() = storage.get("cur_playing", "")
        set(value) = storage.set("cur_playing", value)
    /**
     * 播放模式
     */
    var play_mode: RachelPlayer.PlayMode
        get() {
            val id = storage.get("play_mode", RachelPlayer.PlayMode.ORDER.id)
            return RachelPlayer.PlayMode.entries.find { it.id == id } ?: RachelPlayer.PlayMode.ORDER
        }
        set(value) = storage.set("play_mode", value.id)
}
