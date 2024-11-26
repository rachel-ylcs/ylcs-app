const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const blacklist = require('metro-config/src/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const rnPath = fs.realpathSync(
  path.resolve(require.resolve('react-native/package.json'), '..'),
);
const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-web/package.json'), '..'),
);
const assetRegistryPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-web/dist/cjs/modules/AssetRegistry/index.js'), '..'),
);

/**
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: path.resolve(__dirname),
  transformer: {
    assetRegistryPath: assetRegistryPath,
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
    extraNodeModules: {
      // Redirect react-native to react-native-web
      'react-native': rnwPath,
      'react-native-web': rnwPath,
    },
    blacklistRE: blacklist([
      // Since there are multiple copies of react-native, we need to ensure that metro only sees one of them
      new RegExp(`${(path.resolve(rnPath) + path.sep).replace(/[/\\\\]/g, '\\\\')}.*`),
      // This stops "react-native run-web" from causing the metro server to crash if its already running
      new RegExp(`${path.resolve(__dirname, 'web').replace(/[/\\]/g, '/')}.*`),
      // Ignore native files
      /.+\.native\..+/,
    ]),
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    platforms: ['web'],
  },
  server: {
    port: 3000,
  },
};

module.exports = mergeConfig(getDefaultConfig(), config);
