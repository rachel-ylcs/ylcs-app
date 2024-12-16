package love.yinlin.ylcs.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Icon
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Slider
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.List
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.constraintlayout.compose.ConstraintLayout
import androidx.constraintlayout.compose.Dimension
import love.yinlin.ylcs.Platform
import love.yinlin.ylcs.getPlatform
import org.jetbrains.compose.resources.imageResource
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun Lyrics(modifier: Modifier) {

}

@Composable
fun SongCover(modifier: Modifier) {
    Box(modifier = Modifier.background(Color.White).then(modifier)) {
        Icon(Icons.Rounded.AccountCircle, null, modifier = Modifier.requiredSize(100.dp))
    }
}

@Composable
fun HotpotProgress(modifier: Modifier) {
    Column(modifier = Modifier.then(modifier)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("00:00", color = Color.White)
            Text("00:00", color = Color.White)
        }
        Slider(0.0f, onValueChange = {  }, modifier = Modifier.fillMaxWidth())
    }
}

@Preview
@Composable
fun MusicPlayer() {
    MaterialTheme {
        Box(modifier = Modifier.fillMaxSize().background(Color.Transparent)) {
//            Image(null, null, modifier = Modifier.fillMaxSize())
            Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                Row(modifier = Modifier.fillMaxWidth().background(Color.Dark).padding(5.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                    Text("曲库", color = Color.White)
                    Text("歌单", color = Color.White)
                    Text("工坊", color = Color.White)
                    Text("睡眠", color = Color.White)
                    Text("更多", color = Color.White)
                }
                Lyrics(modifier = Modifier.fillMaxWidth())
                ConstraintLayout(modifier = Modifier.fillMaxWidth().background(Color.Dark, RoundedCornerShape(25.dp, 25.dp))) {
                    val (cover, title, singer, progress, controller, actions) = createRefs()

                    SongCover(modifier = Modifier.constrainAs(cover) {
                        start.linkTo(parent.start, 25.dp)
                        bottom.linkTo(singer.bottom)
                    })
                    Text("无音源", color = Color.SteelBlue, fontSize = 18.sp, modifier = Modifier.constrainAs(title) {
                        start.linkTo(cover.end, margin = 25.dp)
                        end.linkTo(parent.end, margin = 25.dp)
                        top.linkTo(parent.top, margin = 5.dp)
                        width = Dimension.fillToConstraints
                    })
                    Text("未知歌手", color = Color.LightGray, modifier = Modifier.constrainAs(singer) {
                        start.linkTo(title.start)
                        end.linkTo(title.end)
                        top.linkTo(title.bottom)
                        width = Dimension.fillToConstraints
                    })
                    HotpotProgress(modifier = Modifier.padding(10.dp, 5.dp).constrainAs(progress) {
                        start.linkTo(parent.start)
                        end.linkTo(parent.end)
                        top.linkTo(singer.bottom)
                    })
                    Row(modifier = Modifier.constrainAs(controller) {
                        start.linkTo(parent.start)
                        end.linkTo(parent.end)
                        top.linkTo(progress.bottom)
                        bottom.linkTo(parent.bottom, 10.dp)
                        width = Dimension.fillToConstraints
                    }, horizontalArrangement = Arrangement.SpaceAround) {
                        Icon(Icons.Rounded.Refresh, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.ArrowBack, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.PlayArrow, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.ArrowForward, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.List, null, modifier = Modifier.clickable {  }, tint = Color.White)
                    }
                    Row(modifier = Modifier.constrainAs(actions) {
                        start.linkTo(cover.end)
                        end.linkTo(parent.end)
                        bottom.linkTo(parent.top, margin = 5.dp)
                        width = Dimension.fillToConstraints
                    }, horizontalArrangement = Arrangement.SpaceEvenly) {
                        Icon(Icons.Rounded.PlayArrow, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.PlayArrow, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.PlayArrow, null, modifier = Modifier.clickable {  }, tint = Color.White)
                        Icon(Icons.Rounded.PlayArrow, null, modifier = Modifier.clickable {  }, tint = Color.White)
                    }
                }
            }
        }
    }
}
