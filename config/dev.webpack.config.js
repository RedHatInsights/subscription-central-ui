/* eslint-disable */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,

  modules: ['manifests'],
  ...(process.env.BETA && {
    deployment: 'beta/apps',
    useProxy: true,
    customProxy: [
      {
        context: (path) => path.includes('/api/'),
        target: 'https://api.access.qa.redhat.com',
        secure: true,
        changeOrigin: true,
        autoRewrite: true,
        ws: true
      }
    ]
  })
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
