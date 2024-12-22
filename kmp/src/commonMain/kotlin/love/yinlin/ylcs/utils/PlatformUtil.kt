package love.yinlin.ylcs.utils

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
