const { getDefaultConfig } = require("@expo/metro-config");

// const blockList = /\\__tests__\\.*|\\.git\\.*|\\desktop.ini/;
const blockList =
	/(.*\\android\\.*|.*\\__fixtures__\\.*|node_modules[\\\\]react[\\\\]dist[\\\\].*|website\\node_modules\\.*|heapCapture\\bundle\.js|.*\\__tests__\\.*)$/;

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("cjs");

module.exports = {
	...defaultConfig,
	resolver: {
		...defaultConfig.resolver,
		blockList,
	},
};
