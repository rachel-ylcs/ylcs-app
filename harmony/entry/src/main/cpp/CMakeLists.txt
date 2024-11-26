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
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-mmkv-storage/src/main/cpp" ./mmkv_storage)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-unistyles/src/main/cpp" ./unistyles)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-reanimated/src/main/cpp" ./reanimated)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-safe-area-context/src/main/cpp" ./safe_area)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-pager-view/src/main/cpp" ./pager_view)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/flash-list/src/main/cpp" ./flash_list)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-svg/src/main/cpp" ./svg)
add_subdirectory("${OH_MODULE_DIR}/@react-native-oh-tpl/react-native-fast-image/src/main/cpp" ./fast_image)

add_library(rnoh_app SHARED
    PackageProvider.cpp
    ${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp
)

target_link_libraries(rnoh_app PUBLIC
    rnoh
    rnoh_mmkv_storage
    rnoh_unistyles
    rnoh_reanimated
    rnoh_safe_area
    rnoh_pager_view
    rnoh_flash_list
    rnoh_svg
    rnoh_fast_image
)
