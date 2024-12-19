#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.moduleName = @"ylcs";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = @{};

    // 由于ios ImageIO有bug, 需要使用libwebp来解码webp动画
    // 详见 https://github.com/SDWebImage/SDWebImage/issues/3558
    // if (@available(iOS 14.0, *)) {
    //     [[SDImageCodersManager sharedManager] addCoder:[SDImageAWebPCoder sharedCoder]];
    // }
    [[SDImageCodersManager sharedManager] addCoder:[SDImageWebPCoder sharedCoder]];

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
