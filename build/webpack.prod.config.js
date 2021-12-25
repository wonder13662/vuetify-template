const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config')();

config.configureWebpack = merge(config.configureWebpack, {
  // https://webpack.js.org/configuration/devtool/#production
  devtool: '',
  // https://github.com/vuejs/vue-cli/blob/dev/docs/guide/webpack.md
  plugins: [
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BASE_SERVER_URL': '"https://prod.base-server.url"',
      'process.env.BASE_SOCKET_URL': '"https://prod.base-socket.url"',
    }),
  ],
});

module.exports = config;
