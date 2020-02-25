/**
 * @file Main entry point for the application.  Starts up the express server and applies the Apollo Server as a middleware.
 * @author Jonathan Keller
 */
const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');
const express = require('express');
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/order
const parsedConfig = require('./dotenv-secure')(require('dotenv-expand')(require('dotenv-safe').config()));
const createServer = require('./apollo');
const { getLogger } = require('./lib/logger');

const log = getLogger('server');

if (process.env.INSTANCE_ID === 'dev') {
  log.debug('Running with Configuration:');
  log.debug(jsonColorizer(stringify(parsedConfig.parsed, null, 2)));
}

const apollo = createServer();

const app = express();
// JWT is in the token cookie
app.use('*', cookieParser());

apollo.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  bodyParserConfig: true,
});

app.listen({ port: process.env.BACKEND_PORT }, () => {
  log.info(`🚀 Server ready at http://localhost:${process.env.BACKEND_PORT}${apollo.graphqlPath}`);
});
