// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

module.exports = {
  appUrl: '/subscriptions/manifests',
  useProxy: process.env.PROXY === 'true',
  proxyVerbose: true,
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: process.env.NODE_ENV === 'development'
    })
  ],
  hotReload: process.env.HOT === 'true',
  ...(process.env.port ? { port: parseInt(process.env.port) } : {}),
  moduleFederation: {
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: packageJson.dependencies['react-router-dom'],
          requiredVersion: '>=6.0.0 <7.0.0'
        }
      }
    ],
    exposes: {
      './RootApp': resolve(__dirname, './src/AppEntry')
    }
  }
};
