package love.yinlin.ylcs.ui

import androidx.compose.ui.graphics.Color

internal object Colors {

    val Dark = Color(0xC0000000)
    val SteelBlue = Color(0xFF4682B4)
}

val Color.Companion.Dark: Color
    get() = Colors.Dark

val Color.Companion.SteelBlue: Color
    get() = Colors.SteelBlue
