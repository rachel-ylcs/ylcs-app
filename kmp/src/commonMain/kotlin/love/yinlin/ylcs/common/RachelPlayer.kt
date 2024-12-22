package love.yinlin.ylcs.common

import love.yinlin.ylcs.data.music.Playlist
import love.yinlin.ylcs.data.music.PlaylistItem
import love.yinlin.ylcs.data.music.PlaylistJson
import love.yinlin.ylcs.data.music.PlaylistMap
import love.yinlin.ylcs.data.music.PlaylistMapJson
import love.yinlin.ylcs.data.music.SongInfo
import love.yinlin.ylcs.data.music.SongMap
import love.yinlin.ylcs.utils.clearAndAddAll
import love.yinlin.ylcs.utils.moveItem

abstract class RachelPlayer {

    enum class PlayMode(val id: Int) {
        ORDER(0),
        LOOP(1),
        RANDOM(2)
    }

    init {
        reloadData()
    }

    /**
     * 曲库
     */
    private val library: SongMap = mutableMapOf()
    /**
     * 获取全部歌曲
     */
    fun getAllSongs(): List<SongInfo> = library.values.toList()
    /**
     * 按ID获取歌曲
     */
    fun getSong(id: String): SongInfo? = library[id]
    /**
     * 模糊搜索歌曲
     */
    fun searchSong(key: String?): List<SongInfo> =
        (if (key == null) library else library.filter {
            it.value.name.contains(key, true)
        }).map { it.value }
    /**
     * 通知歌曲已添加
     */
    suspend fun notifyAddSong(ids: List<String>) {
//        // 添加前必须停止播放器
//        // 1. 保证了导入时能够覆盖正在播放的音频文件
//        // 2. 无需考虑更新恢复被删除的歌单中的歌曲以及更新新版本的歌曲与元数据
//        val addInfos = mutableListOf<MusicInfo>()
//        val removeInfos = mutableListOf<MusicInfo>()
//        withIO {
//            for (id in ids) {
//                val info: MusicInfo = (pathMusic / (id + MusicRes.INFO_NAME)).readJson()
//                if (info.isCorrect) addInfos += info
//                else removeInfos += info
//            }
//        }
//        for (info in addInfos) musicInfos[info.id] = info
//        for (info in removeInfos) musicInfos.remove(info.id)
    }
    /**
     * 删除歌曲
     */
    suspend fun deleteSong(ids: List<String>) {
//        // 当前正在播放
//        if (currentPlaylist != null) {
//            // 检查播放列表是否存在需要被删除的音乐
//            for (id in ids) {
//                val index = indexOfMusic(id)
//                if (index != -1) player.removeMediaItem(index)
//            }
//        }
//        // 删除所有音乐信息
//        for (selectItem in musicItems) musicInfos.remove(selectItem.id)
//        // 删除本地文件
//        withIO {
//            for (selectItem in musicItems) pathMusic.deleteFilterSafely(selectItem.id)
//        }
    }

    /**
     * 歌单
     */
    private val playlists: PlaylistMap = mutableMapOf()
    /**
     * 获取全部歌单
     */
    fun getAllPlaylists(): List<Playlist> = playlists.values.toList()
    /**
     * 获取全部歌单的名称
     */
    fun getAllPlaylistNames(): List<String> = playlists.keys.toList()
    /**
     * 按名称获取歌单
     */
    fun getPlaylist(name: String): Playlist? = playlists[name]
    /**
     * 创建歌单
     */
    fun createPlaylist(name: String): Boolean {
        if (name.isEmpty() || playlists.containsKey(name)) return false
        playlists[name] = mutableListOf()
        saveData()
        return true
    }
    /**
     * 重命名歌单
     */
    fun renamePlaylist(oldName: String, newName: String): Boolean {
        if (newName.isEmpty() || playlists.containsKey(newName)) return false
        val playlist = playlists[oldName]!!
        playlists.remove(oldName)
        playlists[newName] = playlist
        saveData()
        return true
    }
    /**
     * 删除歌单
     */
    fun deletePlaylist(oldName: String) {
        playlists.remove(oldName)
        saveData()
    }
    /**
     * 添加歌曲到歌单
     */
    fun addSongsIntoPlaylist(playlist: Playlist, songs: List<SongInfo>): Int {
        val newItems = mutableListOf<PlaylistItem>()
        for (song in songs) {
            if (playlist.find { it.id == song.id } != null) {
                newItems += PlaylistItem(song.id, song.name, song.singer)
            }
        }
        if (newItems.isNotEmpty()) {
            playlist.addAll(newItems)
            saveData()
        }
        return newItems.size
    }
    /**
     * 从歌单中删除歌曲
     */
    fun removeSongFromPlaylist(playlist: Playlist, id: String) {
        val position = playlist.indexOfFirst { it.id == id }
        if (position != -1) {
            playlist.removeAt(position)
            saveData()
        }
    }
    /**
     * 移动歌单中的歌曲
     */
    fun moveMusicInPlaylist(playlist: Playlist, oldPosition: Int, newPosition: Int) {
        playlist.moveItem(oldPosition, newPosition)
        saveData()
    }

    /**
     * 当前播放列表
     */
    val currentPlaylist: Playlist = ArrayList()
    /**
     * 当前播放歌曲
     */
    abstract val currentPlaying: SongInfo?
    /**
     * 播放模式
     */
    abstract val playMode: PlayMode

    /**
     * 向正在播放列表中添加歌曲
     */
    fun addAndPlay(song: SongInfo, playNow: Boolean = false) {
        addSongsIntoPlaylist(currentPlaylist, listOf(song))
        if (playNow) {
            play(song.id)
        }
    }
    /**
     * 用歌单替换正在播放列表
     */
    fun replaceAndPlay(songs: List<SongInfo>) {
        currentPlaylist.clearAndAddAll(songs.map {
            PlaylistItem(it.id, it.name, it.singer)
        })
        saveData()
        play(currentPlaylist[0].id)
    }
    /**
     * 从正在播放列表中删除歌曲
     */
    fun remove(id: String) {
        var position = currentPlaylist.indexOfFirst { it.id == id }
        removeSongFromPlaylist(currentPlaylist, id)
        if (position != -1) {
            position %= currentPlaylist.size
            play(currentPlaylist[position].id)
        }
    }
    /**
     * 开始播放
     */
    abstract fun play(id: String?)
    /**
     * 继续/暂停
     */
    abstract fun playOrPause()
    /**
     * 停止播放
     */
    abstract fun stop()
    /**
     * 上一首
     */
    abstract fun prev()
    /**
     * 下一首
     */
    abstract fun next()
    /**
     * 跳转到某时间
     */
    abstract fun seekTo(ms: Long)
    /**
     * 切换播放模式
     */
    abstract fun switchPlayMode()

    /**
     * 在添加或删除歌曲后重新加载曲库和播放列表
     */
    fun reloadData() {
        // 1. 从music目录中读取所有json
        // 2. 读取所有歌单并删除不存在的歌曲
        // 3. 删除正在播放的列表中不存在的歌曲
//        pathMusic.listFiles { file -> file.isFile && file.name.lowercase().endsWith(MusicRes.INFO_NAME) }?.let {
//            for (file in it) {
//                try {
//                    val info: MusicInfo = file.readJson()
//                    if (info.isCorrect) musicInfos[info.id] = info
//                }
//                catch (_: Exception) { }
//            }
//        }
//        playlists.putAll(Config.playlist)
    }
    /**
     * 保存歌单和当前播放列表
     */
    fun saveData() {
        val playlistJson: PlaylistMapJson = mutableMapOf()
        for (playlist in playlists) {
            playlistJson[playlist.key] = PlaylistJson(
                playlist.key, playlist.value.map { it.id }.toMutableList())
        }
        Config.playlists = playlistJson
        Config.cur_playlist = currentPlaylist
    }

    interface Listener {
        fun onMusicModeChanged(mode: PlayMode) {}
        fun onMusicChanged(info: SongInfo?) {}
        fun onMusicReady(info: SongInfo, current: Long, duration: Long) {}
        fun onMusicPlaying(isPlaying: Boolean) {}
        fun onMusicUpdate(position: Long) {}
        fun onMusicStop() {}
        fun onMusicError(error: Exception) {}
    }
    protected val listeners: MutableList<Listener> = ArrayList()
    fun addListener(listener: Listener) = listeners.add(listener)
    fun removeListener(listener: Listener) = listeners.remove(listener)
}
