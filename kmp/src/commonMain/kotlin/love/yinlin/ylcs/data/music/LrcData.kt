package love.yinlin.ylcs.data.music

/**
 * LRC歌词数据
 */
data class LrcData(
    var plainText: String,
    val data: List<LineItem>,
    var maxLengthText: String
) {
    data class LineItem(var position: Long, var text: String)

    companion object {
        fun parseLrcData(source: String): LrcData? = try {
            val items = mutableListOf<LineItem>()
            val plainText = StringBuilder()
            var maxLengthText = ""
            // 解析歌词文件
            val lines = source.split("\\r?\\n".toRegex())
            val pattern = Regex("\\[(\\d{2}):(\\d{2}).(\\d{2,3})](.*)")
            // 前三空行
            items += LineItem(-3, "")
            items += LineItem(-2, "")
            items += LineItem(-1, "")
            for (item in lines) {
                val line = item.trim()
                if (line.isEmpty()) continue
                val matchResult = pattern.find(line)
                if (matchResult != null) {
                    val minutes = matchResult.groupValues[1].toLong()
                    val seconds = matchResult.groupValues[2].toLong()
                    val millisecondsString = matchResult.groupValues[3]
                    var milliseconds = millisecondsString.toLong()
                    if (millisecondsString.length == 2) milliseconds *= 10L
                    val position = (minutes * 60 + seconds) * 1000 + milliseconds
                    val text: String = matchResult.groupValues[4].trim()
                    if (text.isNotEmpty()) {
                        if (text.length > maxLengthText.length) maxLengthText = text
                        items += LineItem(position, text)
                        plainText.appendLine(text)
                    }
                }
            }
            // 后二空行
            items += LineItem(Long.MAX_VALUE - 1, "")
            items += LineItem(Long.MAX_VALUE, "")
            // 排序歌词时间顺序
            if (items.size < 11) throw Exception()
            items.sortWith { o1, o2 -> o1.position.compareTo(o2.position) }
            LrcData(plainText.trimEnd().toString(), items, maxLengthText)
        } catch (_: Exception) { null }
    }
}
