@file:OptIn(ExperimentalResourceApi::class)

package love.yinlin.ylcs.ui

import androidx.compose.material.icons.Icons
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.vectorResource
import ylcs.kmp.generated.resources.*

val Icons.Library: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_library)

val Icons.Playlist: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_playlist)

val Icons.Workshop: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_workshop)

val Icons.SleepMode: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_sleep_mode)

val Icons.Anim: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_anim)

val Icons.Lyrics: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_lyrics)

val Icons.MV: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_mv)

val Icons.Comments: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_comments)

val Icons.PlayerModeOrder: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_mode_order)

val Icons.PlayerModeLoop: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_mode_loop)

val Icons.PlayerModeRandom: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_mode_random)

val Icons.PlayerPrevious: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_previous)

val Icons.PlayerPlay: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_play)

val Icons.PlayerPause: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_pause)

val Icons.PlayerNext: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_next)

val Icons.PlayerPlaylist: ImageVector
    @Composable
    get() = vectorResource(resource = Res.drawable.ic_player_playlist)
