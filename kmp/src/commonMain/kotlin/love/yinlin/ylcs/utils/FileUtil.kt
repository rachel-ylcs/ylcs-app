package love.yinlin.ylcs.utils

import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

object Paths {
    lateinit var appPath: Path
    lateinit var cachePath: Path
    val musicPath: Path get() = appPath.join("music")
}

fun Path.join(vararg parts: String) = Path(this, *parts)
fun Path.exists() = SystemFileSystem.exists(this)
val Path.extension: String get() {
    val index = this.name.lastIndexOf('.')
    if (index != -1) {
        return this.name.substring(index + 1)
    }
    return ""
}
val Path.isFile: Boolean get() {
    val metadata = SystemFileSystem.metadataOrNull(this)
    if (metadata != null) {
        return !metadata.isDirectory
    }
    return false
}
val Path.fileSize: Long get() {
    val metadata = SystemFileSystem.metadataOrNull(this)
    if (metadata != null) {
        return metadata.size
    }
    return 0L
}
val Long.sizeString: String get() = when {
    this < 1024 -> "${this}B"
    this < 1024 * 1024 -> "${this / 1024}KB"
    this < 1024 * 1024 * 1024 -> "${this / 1024 / 1024}MB"
    else -> "${this / 1024 / 1024 / 1024}GB"
}
val Path.fileSizeString: String get() = fileSize.sizeString
