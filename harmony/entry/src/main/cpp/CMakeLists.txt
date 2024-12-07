project(rnapp)
cmake_minimum_required(VERSION 3.4.1)

set(ENV{RNOH_C_API_ARCH} 1)

set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
set(OH_MODULE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${OH_MODULE_DIR}/@rnoh/react-native-openharmony/src/main/cpp")
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(RNOH_GENERATED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/generated")
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
add_compile_definitions(WITH_HITRACE_SYSTRACE)
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use

add_subdirectory("${RNOH_CPP_DIR}" ./rn)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-permissions/src/main/cpp" ./permissions)
add_subdirectory("${OH_MODULE_DIR}/@react-native-ohos/react-native-fs/src/main/cpp" ./fs)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-mmkv-storage/src/main/cpp" ./mmkv_storage)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-unistyles/src/main/cpp" ./unistyles)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-gesture-handler/src/main/cpp" ./gesture_handler)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-reanimated/src/main/cpp" ./reanimated)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-safe-area-context/src/main/cpp" ./safe_area)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-pager-view/src/main/cpp" ./pager_view)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/flash-list/src/main/cpp" ./flash_list)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-svg/src/main/cpp" ./svg)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-fast-image/src/main/cpp" ./fast_image)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-vision-camera/src/main/cpp" ./vision_camera)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-image-picker/src/main/cpp" ./image_picker)

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp")
file(GLOB VISION_CAMERA_CPP_FILES "${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-vision-camera/src/main/cpp/*.cpp")

add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    ${VISION_CAMERA_CPP_FILES}
    PackageProvider.cpp
    ${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp
)

target_link_libraries(rnoh_app PUBLIC
    rnoh
    rnoh_permissions
    rnoh_fs
    rnoh_mmkv_storage
    rnoh_unistyles
    rnoh_gesture_handler
    rnoh_reanimated
    rnoh_safe_area
    rnoh_pager_view
    rnoh_flash_list
    rnoh_svg
    rnoh_fast_image
    rnoh_vision_camera
    rnoh_image_picker
)
