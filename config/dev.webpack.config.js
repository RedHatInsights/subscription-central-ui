/* eslint-disable */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
  modules: ['manifests'],
  useProxy: true,
  useCloud: true,
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'manifests',
    useFileHash: false
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
