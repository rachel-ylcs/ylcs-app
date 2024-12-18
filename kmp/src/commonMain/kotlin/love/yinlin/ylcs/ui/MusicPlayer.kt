@file:OptIn(ExperimentalResourceApi::class)

package love.yinlin.ylcs.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Icon
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.constraintlayout.compose.ConstraintLayout
import androidx.constraintlayout.compose.Dimension
import love.yinlin.ylcs.Platform
import love.yinlin.ylcs.getPlatform
import love.yinlin.ylcs.utils.toTimeString
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.imageResource
import org.jetbrains.compose.ui.tooling.preview.Preview
import ylcs.kmp.generated.resources.Res
import ylcs.kmp.generated.resources.img_record

@Composable
fun Lyrics(modifier: Modifier) {

}

@Composable
fun SongCover(modifier: Modifier) {
    Box(modifier = modifier) {
        Image(imageResource(Res.drawable.img_record), null, modifier = Modifier.matchParentSize())
        Image(ImageBitmap(1, 1), null, modifier = Modifier.align(Alignment.Center).fillMaxSize(0.65f))
    }
}

@Composable
fun HotpotProgress(modifier: Modifier, duration: Long, played: Long, hotpots: List<Long>) {
    Column(modifier = modifier) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(played.toTimeString(true), color = Color.White, fontSize = 14.sp)
            Text(duration.toTimeString(true), color = Color.White, fontSize = 14.sp)
        }
        Canvas(modifier = Modifier.fillMaxWidth().height(12.dp)) {
            val backgroundColor = Color(0xFF808080)
            val playedColor = Color.SteelBlue
            val hotpotColor = Color(0xFFEEEEEE)
            val playedWidth = if (duration == 0L) 0.0f else played * size.width / duration
            val progressHeight = size.height / 3.0f
            val origin = Offset(0f, size.height / 2.0f - progressHeight / 2.0f)
            val radius = progressHeight
            drawRoundRect(backgroundColor, origin, Size(size.width, progressHeight), CornerRadius(radius))
            drawRoundRect(playedColor, origin, Size(playedWidth, progressHeight), CornerRadius(radius))
            if (duration != 0L) {
                for (position in hotpots) {
                    drawCircle(hotpotColor, radius, Offset(position * size.width / duration, size.height / 2.0f))
                }
            }
        }
    }
}

@Preview
@Composable
fun MusicPlayer() {
    val titleState = remember { mutableStateOf("无音源") }
    val singerState = remember { mutableStateOf("") }
    val durationState = remember { mutableStateOf(100L * 1000L) }
    val playedState = remember { mutableStateOf(30L * 1000L) }
    val hotpotsState = remember { mutableStateOf(arrayListOf(10L * 1000L, 30L * 1000L, 50L * 1000L, 90L * 1000L)) }

    RachelTheme {
        Box(modifier = Modifier.fillMaxSize().safeDrawingPadding().background(Color.Transparent)) {
            Image(ImageBitmap(1, 1), null, modifier = Modifier.fillMaxSize())
            Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                Row(modifier = Modifier.fillMaxWidth().background(Color.Dark).padding(5.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                    Column(modifier = Modifier.clickable {  }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Library, null, tint = Color.SteelBlue)
                        Text("曲库", color = Color.White, fontSize = 12.sp)
                    }
                    Column(modifier = Modifier.clickable {  }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Playlist, null, tint = Color.SteelBlue)
                        Text("歌单", color = Color.White, fontSize = 12.sp)
                    }
                    Column(modifier = Modifier.clickable {  }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Workshop, null, tint = Color.SteelBlue)
                        Text("工坊", color = Color.White, fontSize = 12.sp)
                    }
                    Column(modifier = Modifier.clickable {  }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.SleepMode, null, tint = Color.SteelBlue)
                        Text("睡眠", color = Color.White, fontSize = 12.sp)
                    }
                }
                Lyrics(modifier = Modifier.fillMaxWidth().weight(10.0f, fill = true))
                ConstraintLayout(modifier = Modifier.fillMaxWidth().background(Color.Dark, RoundedCornerShape(25.dp, 25.dp))) {
                    val (cover, title, singer, progress, controller, actions, space) = createRefs()

                    SongCover(modifier = Modifier.constrainAs(cover) {
                        start.linkTo(parent.start, 25.dp)
                        bottom.linkTo(singer.bottom)
                        width = Dimension.percent(0.3f)
                        height = Dimension.ratio("1:1")
                    })
                    Text(titleState.value, color = Color.SteelBlue, fontSize = 18.sp, modifier = Modifier.constrainAs(title) {
                        start.linkTo(cover.end, margin = 25.dp)
                        end.linkTo(parent.end, margin = 25.dp)
                        top.linkTo(parent.top, margin = 5.dp)
                        width = Dimension.fillToConstraints
                    })
                    Text(singerState.value, color = Color.LightGray, fontSize = 14.sp, modifier = Modifier.constrainAs(singer) {
                        start.linkTo(title.start)
                        end.linkTo(title.end)
                        top.linkTo(title.bottom)
                        width = Dimension.fillToConstraints
                    })
                    HotpotProgress(modifier = Modifier.padding(15.dp, 5.dp).constrainAs(progress) {
                        start.linkTo(parent.start)
                        end.linkTo(parent.end)
                        top.linkTo(singer.bottom)
                    }, durationState.value, playedState.value, hotpotsState.value)
                    Row(modifier = Modifier.constrainAs(controller) {
                        start.linkTo(parent.start)
                        end.linkTo(parent.end)
                        top.linkTo(progress.bottom, 10.dp)
                        bottom.linkTo(space.top, 20.dp)
                        width = Dimension.fillToConstraints
                    }, horizontalArrangement = Arrangement.SpaceAround) {
                        Icon(Icons.PlayerModeOrder, null, modifier = Modifier.clickable {  }, tint = Color.Unspecified)
                        Icon(Icons.PlayerPrevious, null, modifier = Modifier.clickable {  }, tint = Color.Unspecified)
                        Icon(Icons.PlayerPlay, null, modifier = Modifier.clickable {  }, tint = Color.Unspecified)
                        Icon(Icons.PlayerNext, null, modifier = Modifier.clickable {  }, tint = Color.Unspecified)
                        Icon(Icons.PlayerPlaylist, null, modifier = Modifier.clickable {  }, tint = Color.Unspecified)
                    }
                    Row(modifier = Modifier.constrainAs(actions) {
                        start.linkTo(cover.end)
                        end.linkTo(parent.end)
                        bottom.linkTo(parent.top, margin = 10.dp)
                        width = Dimension.fillToConstraints
                    }, horizontalArrangement = Arrangement.SpaceEvenly) {
                        Icon(Icons.Anim, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Lyrics, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.MV, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Comments, null, modifier = Modifier.clickable {  }, tint = Color.White)
                    }
                    Spacer(modifier = Modifier.constrainAs(space) {
                        bottom.linkTo(parent.bottom)
                        height = Dimension.value(50.dp)
                    }) // 为rn的导航栏预留空间
                }
            }
        }
    }
}
