const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

// This fix is needed because otherwise Patternfly will
// import all the Patternfly CSS and bloat the bundle

const patternflyTreeshakingCSSFixRule = {
  test: /\.css$/i,
  include: /@patternfly\/react-styles\/css/,
  use: 'null-loader'
};

// Adding Patternfly treeshaking rule to the beginning of Webpack rules array
webpackConfig.module.rules.unshift(patternflyTreeshakingCSSFixRule);

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    useFileHash: false
  })
);
module.exports = {
  ...webpackConfig,
  plugins
};
