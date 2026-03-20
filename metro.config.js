const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { withShareExtension } = require("expo-share-extension/metro");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");

const config = getDefaultConfig(__dirname);

config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
};

const shareExtensionConfig = withShareExtension(config, { isCSSEnabled: true });

const nativeWindConfig = withNativeWind(shareExtensionConfig, {
    input: "./styles/global.css",
});

module.exports = withStorybook(nativeWindConfig, {
    enabled: process.env.STORYBOOK === "true",
    configPath: "./.rnstorybook",
});