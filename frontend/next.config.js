const path = require('path')

require('dotenv-expand')(require('dotenv-safe').config({
  debug: true,
  path: `${process.env.DOTENV_CONFIG_PATH}/.env`,
  // example: `${process.env.DOTENV_CONFIG_PATH}/.env.example`,
}));
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withCSS(withSass({
  publicRuntimeConfig: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  serverRuntimeConfig: {
    SERVER_BACKEND_URL: process.env.SERVER_BACKEND_URL,
  },
  webpack(config, options) {
    config.resolve.alias['components'] = path.join(__dirname, 'components')
    config.resolve.alias['lib'] = path.join(__dirname, 'lib')
    return config
  },
}));
