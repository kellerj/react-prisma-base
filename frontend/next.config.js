const nextRuntimeDotenv = require('next-runtime-dotenv');
// console.log(process.env);
require('dotenv-expand')(require('dotenv-safe').config({
  debug: true,
  path: `${process.env.DOTENV_CONFIG_PATH}/.env`,
  // example: `${process.env.DOTENV_CONFIG_PATH}/.env.example`,
}));
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = nextRuntimeDotenv(withCSS(withSass({
  public: [
    'BACKEND_URL,',
  ],
  server: [
    'SERVER_BACKEND_URL',
  ],
})));
