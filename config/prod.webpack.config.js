/* eslint-disable */

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  modules: ['manifests'],
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

const dotEnvParams = {
  defaults: resolve(__dirname, '../.env')
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  dotEnvParams.path = resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
}

plugins.push(new Dotenv({ ...dotEnvParams }));

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'manifests'
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
