/* eslint-disable */

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  modules: ['manifests'],
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config-utilities/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'manifests',
    shared: [
      {
        'react-router-dom': { singleton: true, requiredVersion: '*', version: '*' }
      }
    ]
  })
);

module.exports = function (env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins
  };
};
