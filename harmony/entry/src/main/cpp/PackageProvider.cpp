#include "RNOH/PackageProvider.h"
#include "MMKVNativePackage.h"
#include "UnistylesPackage.h"
#include "ReanimatedPackage.h"
#include "SafeAreaViewPackage.h"
#include "ViewPagerPackage.h"
#include "FlashListPackage.h"
#include "SVGPackage.h"
#include "FastImagePackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
        std::make_shared<RNOHMMKVStoragePackage>(ctx),
        std::make_shared<UnistylesPackage>(ctx),
        std::make_shared<ReanimatedPackage>(ctx),
        std::make_shared<SafeAreaViewPackage>(ctx),
        std::make_shared<ViewPagerPackage>(ctx),
        std::make_shared<FlashListPackage>(ctx),
        std::make_shared<SVGPackage>(ctx),
        std::make_shared<FastImagePackage>(ctx),
    };
}
