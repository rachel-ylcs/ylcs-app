package love.yinlin.ylcs.utils

fun Long.toTimeString(short: Boolean = false): String = buildString {
    val hour = this@toTimeString / (1000 * 60 * 60)
    val minute = this@toTimeString % (1000 * 60 * 60) / (1000 * 60)
    val second = this@toTimeString % (1000 * 60) / 1000
    if (!short || hour > 0) append(hour.toString().padStart(2, '0')).append(':')
    append(minute.toString().padStart(2, '0')).append(':')
    append(second.toString().padStart(2, '0'))
}
