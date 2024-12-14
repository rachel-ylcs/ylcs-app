plugins {
    id("com.android.library")
    kotlin("multiplatform")
    id("org.jetbrains.compose")
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "17"
            }
        }
    }

    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach {
        it.binaries.framework {
            baseName = "kmp"
            isStatic = true
        }
    }

    sourceSets {
        androidMain {
            dependencies {
                api("androidx.activity:activity-compose:1.9.3")
                api("androidx.fragment:fragment-ktx:1.8.5")
                implementation(compose.preview) // Preview in Android Studio
            }
        }
        iosMain.dependencies {

        }
        commonMain.dependencies {
            api(compose.runtime)
            api(compose.foundation)
            api(compose.ui)
            api(compose.material)
            api(compose.components.resources)
            implementation(compose.components.uiToolingPreview) // Preview in Fleet
        }
    }
}

android {
    val compileSdkVersion: Int by rootProject.extra
    val minSdkVersion: Int by rootProject.extra

    namespace = "love.yinlin.ylcs"
    compileSdk = compileSdkVersion
    defaultConfig {
        minSdk = minSdkVersion
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }
    buildFeatures {
        buildConfig = false // 避免和app模块中的BuildConfig冲突
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.13"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    dependencies {
        debugImplementation(compose.uiTooling) // Run Preview on Android Device
    }
}
