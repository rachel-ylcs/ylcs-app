package love.yinlin.ylcs.data.music

import kotlinx.io.files.Path
import love.yinlin.ylcs.utils.extension
import love.yinlin.ylcs.utils.fileSizeString
import love.yinlin.ylcs.utils.isFile

/**
 * 音乐资源
 */
data class MusicRes(
    var id: Type,
    var name: String,
    var ext: String,
    var description: String,
    var canDelete: Boolean,
    var canEdit: Boolean,
    var fileSize: String = "0B",
) {
    enum class Type {
        UNKNOWN, // 未知资源
        INFO, // 元数据信息
        AUDIO, // 音频
        RECORD, // CD封面
        BGS, // 静态背景
        DEFAULT_LRC, // 默认歌词
        VIDEO, // 视频 PV
        BGD, // 动态背景
        LRC, // LRC歌词
        PAG, // PAG动效
    }

    companion object {
        const val INFO_NAME = ".json"
        const val AUDIO_NAME = ".flac"
        const val RECORD_NAME = "_record.webp"
        const val BGS_NAME = "_bgs.webp"
        const val DEFAULT_LRC_NAME = ".lrc"
        const val VIDEO_NAME = ".mp4"
        const val BGD_NAME = "_bgd.webp"

        private val Unknown = MusicRes(
            Type.UNKNOWN, "", "", "未知资源",
            canDelete = true, canEdit = true)
        private val Info = MusicRes(
            Type.INFO, INFO_NAME, "json", "元数据信息",
            canDelete = false, canEdit = false)
        private val Audio = MusicRes(
            Type.AUDIO, AUDIO_NAME, "flac", "音频",
            canDelete = false, canEdit = true)
        private val Record = MusicRes(
            Type.RECORD, RECORD_NAME, "webp", "封面",
            canDelete = false, canEdit = true)
        private val Bgs = MusicRes(
            Type.BGS, BGS_NAME, "webp", "静态壁纸",
            canDelete = false, canEdit = true)
        private val DefaultLrc = MusicRes(
            Type.DEFAULT_LRC, DEFAULT_LRC_NAME, "lrc", "默认歌词",
            canDelete = false, canEdit = true)
        private val Video = MusicRes(
            Type.VIDEO, VIDEO_NAME, "mp4", "视频/PV",
            canDelete = true, canEdit = true)
        private val Bgd = MusicRes(
            Type.BGD, BGD_NAME, "webp", "动画壁纸",
            canDelete = true, canEdit = true)
        private val Lrc = MusicRes(
            Type.LRC, "", "lrc", "逐行歌词",
            canDelete = true, canEdit = true)
        private val Pag = MusicRes(
            Type.PAG, "", "pag", "动态歌词",
            canDelete = true, canEdit = true)

        private val RES_KNOWN_MAP = mapOf(
            Info.name to Info,
            Audio.name to Audio,
            Record.name to Record,
            Bgs.name to Bgs,
            DefaultLrc.name to DefaultLrc,
            Video.name to Video,
            Bgd.name to Bgd,
        )

        private val RES_EXT_MAP = mapOf(
            Lrc.ext to Lrc,
            Pag.ext to Pag
        )

        fun checkResFile(id: String, file: Path): Boolean {
            if (!file.isFile) return false
            val name = file.name
            if (!name.startsWith(id)) return false
            val resName = name.removePrefix(id)
            if (resName.indexOf('.') == -1) return false
            if (!resName.startsWith('.') && !resName.startsWith('_')) return false
            return file.extension.isNotEmpty()
        }

        fun parse(id: String, file: Path): MusicRes {
            val fs = file.fileSizeString
            val name = file.name.removePrefix(id)
            val ext = file.extension
            val resBasicInfo = RES_KNOWN_MAP[name]
            if (resBasicInfo != null) return resBasicInfo.clone(fs)
            val resInfo = RES_EXT_MAP[ext] ?: Unknown
            return MusicRes(resInfo.id, name, ext, resInfo.description, resInfo.canDelete, resInfo.canEdit, fs)
        }
    }

    fun clone(fs: String) = MusicRes(id, name, ext, description, canDelete, canEdit, fs)
}
