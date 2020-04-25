module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      'crypto': require.resolve('react-native-crypto'),
      'stream': require.resolve('stream-browserify'),
      'vm': require.resolve('vm-browserify'),
      'path': require.resolve('path-browserify'),
      'randombytes': require.resolve('react-native-randombytes'),
      'net': require.resolve('react-native-tcp'),
      'dgram': require.resolve('react-native-udp'),
      'dns': require.resolve('./dns-shim.js'),
      'os': require.resolve('react-native-os'),
      'fs': require.resolve('./empty'),
    },
  },
};
