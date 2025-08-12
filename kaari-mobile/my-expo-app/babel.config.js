module.exports = function (api) {
  api.cache(true);
  let plugins = [
    // Reanimated plugin must be listed last
    'react-native-reanimated/plugin',
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
