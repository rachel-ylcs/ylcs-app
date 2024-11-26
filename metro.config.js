const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { createHarmonyMetroConfig } = require('@react-native-oh/react-native-harmony/metro.config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const harmonyConfig = createHarmonyMetroConfig({
  reactNativeHarmonyPackageName: '@react-native-oh/react-native-harmony',
});

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native'
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: (ctx, moduleName, platform) => {
      if (platform !== 'harmony' && moduleName === 'react-native-fast-image') {
        return ctx.resolveRequest(ctx, '@d11/react-native-fast-image', platform);
      }
      if (platform === 'harmony' && moduleName.startsWith('react-native-tab-view/src/')) {
        return ctx.resolveRequest(ctx, moduleName, platform);
      }
      return harmonyConfig.resolver.resolveRequest(ctx, moduleName, platform);
    },
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, harmonyConfig, config);
