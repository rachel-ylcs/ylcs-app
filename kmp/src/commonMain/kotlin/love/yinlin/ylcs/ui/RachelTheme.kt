package love.yinlin.ylcs.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColors(
    primary = Color.SteelBlue,
    primaryVariant = Color.Purple,
    secondary = Color.OrangeRed,
)

private val DarkColors = darkColors(
    primary = Color.SteelBlue,
    primaryVariant = Color.Purple,
    secondary = Color.OrangeRed,
)

@Composable
fun RachelTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colors = if (!darkTheme) LightColors else DarkColors,
        content = content
    )
}
