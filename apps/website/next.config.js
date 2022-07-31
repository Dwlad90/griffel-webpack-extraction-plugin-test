const {
  GriffelCSSExtractionPlugin
} = require("@griffel/webpack-extraction-plugin");

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.optimization.splitChunks = config.optimization.splitChunks || {
      cacheGroups: {}
    };

    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: [

        { loader: GriffelCSSExtractionPlugin.loader },
        { loader: "@griffel/webpack-loader" },
        {
          loader: 'babel-loader',
          options: {
            sourceMaps: true,
            presets: [
              ['@babel/preset-react', {
                runtime: "automatic",
              }]
            ]
          }
        },
      ]
    });
    config.plugins.push(new GriffelCSSExtractionPlugin());

    return config;
  }
};
