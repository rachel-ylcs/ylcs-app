package love.yinlin.ylcs

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
