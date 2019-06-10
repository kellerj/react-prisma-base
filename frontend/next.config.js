// console.log(process.env);
require('dotenv-expand')(require('dotenv-safe').config({
  debug: true,
  path: `${process.env.DOTENV_CONFIG_PATH}/.env`,
  // example: `${process.env.DOTENV_CONFIG_PATH}/.env.example`,
}));
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withCSS(withSass({
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
  serverRuntimeConfig: {
    backendUrl: process.env.SERVER_BACKEND_URL || process.env.BACKEND_URL,
  },
}));
