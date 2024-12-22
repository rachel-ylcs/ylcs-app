package love.yinlin.ylcs.common

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.annotation.OptIn
import androidx.core.content.FileProvider
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaController
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionToken
import love.yinlin.ylcs.R
import love.yinlin.ylcs.data.music.SongInfo
import love.yinlin.ylcs.service.MusicService
import love.yinlin.ylcs.utils.toFile

@OptIn(UnstableApi::class)
class RachelPlayerAndroid(val context: Context) : RachelPlayer(), Player.Listener {

    companion object {
        /**
         * 更新频率
         */
        const val UPDATE_FREQUENCY: Long = 100L
    }

    private var handler: Handler = Handler(Looper.getMainLooper())
    private lateinit var player: MediaController
    override val currentPlaying: SongInfo? get() {
        return player.currentMediaItem?.mediaId?.let { getSong(it) }
    }
    override val playMode: PlayMode get() {
        val mode = send(MusicService.Command.GetMode).getInt(MusicService.Command.ARG_MODE, PlayMode.ORDER.id)
        return PlayMode.entries.find { it.id == mode }!!
    }
    /**
     * 播放器更新回调
     */
    private val onTimeUpdate = object : Runnable {
        override fun run() {
            for (listener in listeners) {
                listener.onMusicUpdate(player.currentPosition)
            }
            handler.postDelayed(this, UPDATE_FREQUENCY)
        }
    }

    init {
        val sessionToken = SessionToken(context, ComponentName(context, MusicService::class.java))
        val mediaControllerFuture = MediaController.Builder(context, sessionToken).buildAsync()
        player = mediaControllerFuture.get()
        player.addListener(this)
    }

    fun release() {
        handler.removeCallbacks(onTimeUpdate)
        player.removeListener(this)
    }

    override fun play(id: String?) {
        if (currentPlaylist.isEmpty()) {
            stop()
            return
        }
        val mediaItems = currentPlaylist.map {
            getSong(it.id)!!.toMediaItem()
        }
        if (mediaItems.isNotEmpty()) {
            player.clearMediaItems()
            val startIndex = mediaItems.indexOfFirst { it.mediaId == id }
            if (startIndex == -1) player.setMediaItems(mediaItems, false)
            else player.setMediaItems(mediaItems, startIndex, 0L)
            player.prepare()
            player.play()
        }
    }

    override fun playOrPause() = if (player.isPlaying) player.pause() else player.play()

    override fun stop() = player.stop()

    override fun prev() = player.seekToPreviousMediaItem()

    override fun next() = player.seekToNextMediaItem()

    override fun seekTo(ms: Long) = player.seekTo(ms)

    override fun switchPlayMode() = send(MusicService.Command.SwitchMode).let {}

    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
        val songInfo = mediaItem?.let { getSong(it.mediaId) }
        Config.cur_playing = songInfo?.id ?: ""
        for (listener in listeners) {
            listener.onMusicChanged(songInfo)
        }
        if (songInfo != null) {
            val duration = player.duration
            if (reason == Player.MEDIA_ITEM_TRANSITION_REASON_AUTO && duration != C.TIME_UNSET) {
                for (listener in listeners) {
                    listener.onMusicReady(songInfo, player.currentPosition, duration)
                }
            }
        }
    }

    override fun onPlaybackStateChanged(playbackState: Int) {
        when (playbackState) {
            Player.STATE_IDLE -> {
                currentPlaylist.clear()
                for (listener in listeners) {
                    listener.onMusicStop()
                }
            }
            Player.STATE_BUFFERING -> { }
            Player.STATE_READY -> {
                val musicInfo = player.currentMediaItem?.let { getSong(it.mediaId) }
                val duration = player.duration
                if (musicInfo != null && duration != C.TIME_UNSET) {
                    for (listener in listeners) {
                        listener.onMusicReady(musicInfo, player.currentPosition, duration)
                    }
                }
            }
            Player.STATE_ENDED -> {
                if (player.mediaItemCount == 0) player.stop()
                else if (!player.isPlaying) player.play()
            }
        }
    }

    override fun onIsPlayingChanged(isPlaying: Boolean) {
        handler.removeCallbacks(onTimeUpdate)
        if (isPlaying) handler.post(onTimeUpdate)
        for (listener in listeners) {
            listener.onMusicPlaying(isPlaying)
        }
    }

    override fun onRepeatModeChanged(repeatMode: Int) {
        for (listener in listeners) {
            listener.onMusicModeChanged(playMode)
        }
    }

    override fun onShuffleModeEnabledChanged(shuffleModeEnabled: Boolean) {
        for (listener in listeners) {
            listener.onMusicModeChanged(playMode)
        }
    }

    override fun onPlayerError(error: PlaybackException) {
        player.stop()
        for (listener in listeners) {
            listener.onMusicError(error)
        }
    }

    /**
     * 发送命令
     */
    private fun send(command: SessionCommand, args: Bundle = Bundle.EMPTY): Bundle =
        if (player.isConnected) player.sendCustomCommand(command, args).get().extras
        else Bundle.EMPTY

    /**
     * 生成播放媒体
     */
    private fun SongInfo.toMediaItem(): MediaItem = MediaItem.Builder()
        .setMediaId(this.id)
        .setUri(Uri.fromFile(this.audioPath.toFile()))
        .setMediaMetadata(
            MediaMetadata.Builder()
                .setTitle(this.name)
                .setArtist(this.singer)
                .setAlbumTitle(this.album)
                .setAlbumArtist(this.singer)
                .setComposer(this.composer)
                .setWriter(this.lyricist)
                .setArtworkUri(FileProvider.getUriForFile(
                    context, context.getString(R.string.app_provider), this.recordPath.toFile()))
                .build())
        .build()
}
