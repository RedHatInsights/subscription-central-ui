/* eslint-disable */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const Dotenv = require('dotenv-webpack');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
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
    moduleName: 'manifests',
    useFileHash: false
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
