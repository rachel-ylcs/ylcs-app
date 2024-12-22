package love.yinlin.ylcs.data.mod

import love.yinlin.ylcs.common.RachelMod.MOD_VERSION

/**
 * MOD元数据
 */
data class Metadata(
    /**
     * MOD版本
     */
    var version: Int = MOD_VERSION,
    /**
     * MOD配置
     */
    var config: String = "",
    /**
     * 音乐集
     */
    val items: Map<String, MusicItem> = HashMap()
) {
    val empty: Boolean get() = items.isEmpty()
    val totalCount: Int get() = items.entries.sumOf { it.value.resources.size }
}
