// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan base path untuk export web di subfolder
config.resolver.assetExts.push('html');

// 👇 Ini sangat penting
config.transformer.publicPath = '/app/';

module.exports = config;