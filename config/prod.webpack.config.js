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

const envFileName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development';
const envPath = resolve(__dirname, `../${envFileName}`);
plugins.push(new Dotenv({ path: envPath, defaults: resolve(__dirname, '../.env') }));

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
