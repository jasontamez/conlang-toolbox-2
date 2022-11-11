// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
//const path = require('path');
const defaults = require('metro-config/src/defaults/defaults');
const defaultSourceExts = defaults.sourceExts;
//module.exports = getDefaultConfig(__dirname);

//const blackList = /.*git.*|.*android.*|.*__fixtures__.*|.*node_modules.*|.*react.*|.*dist.*|.*website\\node_modules.*|.heapCapture\\bundle.js|.*__tests__.*/gm

//module.exports = {
//	...getDefaultConfig(__dirname),
//	resolver: {
//		blockList: blackList,
//		blackListRE: blackList,
//	},
//	watchFolders: [path.resolve('node_modules')]
//};


module.exports = {
  ...getDefaultConfig(__dirname),
  transformer: {
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: process.env.RN_SRC_EXT
      ? [...process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts), 'cjs'] // <-- cjs added here
      : [...defaultSourceExts, 'cjs'], // <-- cjs added here
  },
};
