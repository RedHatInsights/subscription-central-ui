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
  appUrl: process.env.BETA
    ? [
        '/beta/insights/subscriptions',
        '/preview/insights/subscriptions',
        '/beta/subscriptions',
        '/preview/subscriptions'
      ]
    : ['/insights/subscriptions', '/subscriptions'],
  env: process.env.BETA ? 'stage-beta' : 'stage-stable',
  ...(process.env.BETA && { deployment: 'beta/apps' }),
  useCache: true
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'manifests',
    useFileHash: false,
    shared: [
      {
        'react-router-dom': { singleton: true, requiredVersion: '*' }
      }
    ]
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
