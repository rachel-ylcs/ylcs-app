#include "RNOH/PackageProvider.h"
#include "generated/RNOHGeneratedPackage.h"
#include "PermissionsPackage.h"
#include "RNFSPackage.h"
#include "MMKVNativePackage.h"
#include "UnistylesPackage.h"
#include "GestureHandlerPackage.h"
#include "ReanimatedPackage.h"
#include "SafeAreaViewPackage.h"
#include "ViewPagerPackage.h"
#include "FlashListPackage.h"
#include "SVGPackage.h"
#include "FastImagePackage.h"
#include "VisionCameraPackage.h"
#include "RNImagePickerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
        std::make_shared<RNOHGeneratedPackage>(ctx),
        std::make_shared<PermissionsPackage>(ctx),
        std::make_shared<RNFSPackage>(ctx),
        std::make_shared<RNOHMMKVStoragePackage>(ctx),
        std::make_shared<UnistylesPackage>(ctx),
        std::make_shared<GestureHandlerPackage>(ctx),
        std::make_shared<ReanimatedPackage>(ctx),
        std::make_shared<SafeAreaViewPackage>(ctx),
        std::make_shared<ViewPagerPackage>(ctx),
        std::make_shared<FlashListPackage>(ctx),
        std::make_shared<SVGPackage>(ctx),
        std::make_shared<FastImagePackage>(ctx),
        std::make_shared<VisionCameraPackage>(ctx),
        std::make_shared<RNImagePickerPackage>(ctx),
    };
}
