package love.yinlin.ylcs.data.music

import androidx.compose.ui.graphics.Color

/**
 * 状态栏歌词设置
 */
data class LyricsSettings(
    /**
     * 左侧偏移 0.0 ~ 1.0
     */
    var offsetLeft: Float = 0.0f,
    /**
     * 右侧偏移 0.0 ~ 1.0
     */
    var offsetRight: Float = 1.0f,
    /**
     * 纵向偏移 0.0 ~ 2.0
     */
    var offsetY: Float = 1.0f,
    /**
     * 字体大小 0.75 ~ 1.5
     */
    var textSize: Float = 1.0f,
    /**
     * 字体颜色
     */
    var textColor: Color = Color(70, 130, 180),
    /**
     * 背景颜色
     */
    var backgroundColor: Color = Color.Unspecified
)
