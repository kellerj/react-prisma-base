const path = require('path');
const nextBuildId = require('next-build-id');
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

require('dotenv-expand')(require('dotenv-safe').config({
  debug: true,
  path: `${process.env.DOTENV_CONFIG_PATH}/.env`,
  // example: `${process.env.DOTENV_CONFIG_PATH}/.env.example`,
}));
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = phase => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isLocal = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.INSTANCE_ID === 'prd';
  const isTestServer = phase === PHASE_PRODUCTION_BUILD && process.env.INSTANCE_ID !== 'prd';
  const instanceId = process.env.INSTANCE_ID;

  console.log(`isLocal:${isLocal} / isProd:${isProd} / isTestServer:${isTestServer}`);

  const config = withCSS(withSass({
    publicRuntimeConfig: {
      frontendUrl: process.env.FRONTEND_URL,
      backendUrl: process.env.BACKEND_URL,
      appName: process.env.APP_NAME,
      instanceId,
    },
    serverRuntimeConfig: {
      backendUrl: process.env.SERVER_BACKEND_URL || process.env.BACKEND_URL,
    },
    // eslint-disable-next-line no-unused-vars
    webpack(config, options) {
      config.resolve.alias['components'] = path.join(__dirname, 'components');
      config.resolve.alias['lib'] = path.join(__dirname, 'lib');
      return config;
    },
    generateBuildId: () => nextBuildId({ dir: __dirname, describe: true }),
    poweredByHeader: false,
  }));

  if ( isLocal ) {
    console.log(JSON.stringify(config, null, 2));
  } else {
    // There will be no secrets in the public config - so safe to dump that
    console.log(JSON.stringify(config.publicRuntimeConfig, null, 2));
  }
  return config;
};
