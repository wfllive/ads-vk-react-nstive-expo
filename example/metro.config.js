const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Добавляем родительскую папку (библиотеку) в watchFolders
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, '..'),
];

// Резолвим src/ библиотеки как модуль
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    'ads-vk-react-native-expo': path.resolve(__dirname, '..'),
  },
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, '..', 'node_modules'),
  ],
};

module.exports = config;
