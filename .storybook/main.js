module.exports = {
  stories: ["../stories/**/*.stories.(ts|tsx|js|jsx)"],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
