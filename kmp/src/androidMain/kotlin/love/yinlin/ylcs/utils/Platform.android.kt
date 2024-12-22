package love.yinlin.ylcs.utils

import android.content.Context
import android.content.Intent
import kotlinx.io.files.Path
import java.io.File

class AndroidPlatform : Platform {
    override val name: String = "Android ${android.os.Build.VERSION.SDK_INT}"
}

actual fun getPlatform(): Platform = AndroidPlatform()

fun Path.toFile() = File(this.toString())

fun Context.getLauncherActivity(pkgName: String): String? {
    val intent = Intent(Intent.ACTION_MAIN, null)
    intent.addCategory(Intent.CATEGORY_LAUNCHER)
    intent.setPackage(pkgName)
    val info = packageManager.queryIntentActivities(intent, 0)
    return info[0].activityInfo.name
}

fun Context.getLaunchAppIntent(pkgName: String): Intent? =
    getLauncherActivity(pkgName)?.let {
        val intent = Intent(Intent.ACTION_MAIN)
        intent.addCategory(Intent.CATEGORY_LAUNCHER)
        intent.setClassName(pkgName, it)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
