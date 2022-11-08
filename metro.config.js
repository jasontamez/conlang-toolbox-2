// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

//module.exports = getDefaultConfig(__dirname);

const blackList = /.*git.*|.*android.*|.*__fixtures__.*|.*node_modules.*|.*react.*|.*dist.*|.*website\\node_modules.*|.heapCapture\\bundle.js|.*__tests__.*/gm

module.exports = {
	...getDefaultConfig(__dirname),
	resolver: {
		blockList: blackList,
		blackListRE: blackList,
	}
};

