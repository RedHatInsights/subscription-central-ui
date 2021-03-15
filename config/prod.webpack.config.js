const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../')
  })
);

// This fix is needed because otherwise Patternfly will
// import all the Patternfly CSS and bloat the bundle

const patternflyTreeshakingCSSFixRule = {
  test: /\.css$/i,
  include: /@patternfly\/react-styles\/css/,
  use: 'null-loader'
};

// Adding Patternfly treeshaking rule to the beginning of Webpack rules array
webpackConfig.module.rules.unshift(patternflyTreeshakingCSSFixRule);

module.exports = function (env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins
  };
};
