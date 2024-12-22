package love.yinlin.ylcs.service

import android.app.PendingIntent
import android.content.Intent
import android.os.Bundle
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.CommandButton
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionResult
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import love.yinlin.ylcs.common.Config
import love.yinlin.ylcs.common.RachelPlayer.PlayMode
import love.yinlin.ylcs.utils.getLaunchAppIntent

@UnstableApi
class MusicService : MediaSessionService(), MediaSession.Callback {

    object Command {
        const val ARG_MODE = "Mode"
        val GetMode = SessionCommand("GetMode", Bundle.EMPTY)
        val SwitchMode = SessionCommand("SwitchMode", Bundle.EMPTY)
    }

    private lateinit var player: ExoPlayer
    private lateinit var session: MediaSession

    private val buttonOrderMode = CommandButton.Builder()
        .setDisplayName("顺序播放")
//        .setIconResId(R.drawable.icon_play_mode_order)
        .setSessionCommand(Command.SwitchMode)
        .setSlots(CommandButton.SLOT_FORWARD_SECONDARY)
        .build()
    private val buttonLoopMode = CommandButton.Builder()
        .setDisplayName("单曲循环")
//        .setIconResId(R.drawable.icon_play_mode_loop)
        .setSessionCommand(Command.SwitchMode)
        .setSlots(CommandButton.SLOT_FORWARD_SECONDARY)
        .build()
    private val buttonRandomMode = CommandButton.Builder()
        .setDisplayName("随机播放")
//        .setIconResId(R.drawable.icon_player_mode_random)
        .setSessionCommand(Command.SwitchMode)
        .setSlots(CommandButton.SLOT_FORWARD_SECONDARY)
        .build()
    private fun buttonMode(mode: PlayMode) = when (mode) {
        PlayMode.ORDER -> buttonOrderMode
        PlayMode.LOOP -> buttonLoopMode
        PlayMode.RANDOM -> buttonRandomMode
    }

    override fun onCreate() {
        super.onCreate()
        player = ExoPlayer.Builder(applicationContext)
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(C.USAGE_MEDIA)
                    .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
                    .build(), true
            )
            .setHandleAudioBecomingNoisy(true)
//            .setRenderersFactory(FfmpegRenderersFactory(context))
            .build()
        val mode = Config.play_mode
        player.updatePlayMode(mode)
        session = MediaSession.Builder(this, player)
            .setCallback(this)
            .setMediaButtonPreferences(listOf(buttonMode(mode)))
            .setSessionActivity(
                PendingIntent.getActivity(
                    this,
                    0,
                    getLaunchAppIntent(packageName)!!.apply {
                        action = Intent.ACTION_VIEW
                        addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                        addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    },
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            )
            .build()
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        if (!player.playWhenReady
            || player.mediaItemCount == 0
            || player.playbackState == Player.STATE_ENDED) {
            stopSelf()
        }
    }

    override fun onDestroy() {
        session.release()
        player.release()
        super.onDestroy()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo) = session

    override fun onConnect(session: MediaSession, controller: MediaSession.ControllerInfo) =
        MediaSession.ConnectionResult.AcceptedResultBuilder(session)
            .setAvailablePlayerCommands(
                MediaSession.ConnectionResult.DEFAULT_PLAYER_COMMANDS.buildUpon()
                    .build())
            .setAvailableSessionCommands(
                MediaSession.ConnectionResult.DEFAULT_SESSION_COMMANDS.buildUpon()
                    .add(Command.GetMode)
                    .add(Command.SwitchMode)
                    .build())
            .build()

    override fun onCustomCommand(
        session: MediaSession,
        controller: MediaSession.ControllerInfo,
        customCommand: SessionCommand,
        args: Bundle
    ): ListenableFuture<SessionResult> = when (customCommand) {
        Command.GetMode -> {
            val ret = Bundle().apply { putInt(Command.ARG_MODE, Config.play_mode.id) }
            Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS, ret))
        }
        Command.SwitchMode -> {
            val nextMode = when (val mode = Config.play_mode) {
                PlayMode.ORDER -> PlayMode.LOOP
                PlayMode.LOOP -> PlayMode.RANDOM
                PlayMode.RANDOM -> PlayMode.ORDER
                else -> mode
            }
            player.updatePlayMode(nextMode)
            session.setMediaButtonPreferences(listOf(buttonMode(nextMode)))
            Config.play_mode = nextMode
            Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
        }
        else -> super.onCustomCommand(session, controller, customCommand, args)
    }

    private fun Player.updatePlayMode(mode: PlayMode) {
        when (mode) {
            PlayMode.ORDER -> {
                repeatMode = Player.REPEAT_MODE_ALL
                shuffleModeEnabled = false
            }
            PlayMode.LOOP -> {
                repeatMode = Player.REPEAT_MODE_ONE
                shuffleModeEnabled = false
            }
            PlayMode.RANDOM -> {
                repeatMode = Player.REPEAT_MODE_ALL
                shuffleModeEnabled = true
            }
        }
    }
}
