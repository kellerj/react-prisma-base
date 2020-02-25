/**
 * Apollo Server setup/configuration.
 * @module
 */
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const jsonColorizer = require('json-colorizer');
const { getLogger } = require('./lib/logger');

const log = getLogger('server');

const prisma = require('./prisma').bindings;
const schema = require('./schema');

/**
 * Express Middleware Function: Decodes and verifies the JWT from the `token` cookie.
 * Sets `sub` (subject) of the decoded token into the request.
 *
 * @param {*} req Express request object
 * @returns the `sub` from the JWT token
 */
const decodeJwt = (req) => {
  // console.log('JWT Middleware');
  // console.log(req);
  // We look for either the cookie or the header - the latter mainly to allow use via the GraphQL Playground
  const apiAuthToken = req.cookies.apiAuthToken || req.headers.apiauthtoken;
  // console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
  // console.log(`Headers: ${jsonColorizer(req.headers)}`);
  // console.log(`JWT Token: ${apiAuthToken}`);
  if (apiAuthToken) {
    const decodedToken = jwt.verify(apiAuthToken, process.env.JWT_SECRET);
    log.debug(`Decoded Token: ${jsonColorizer(decodedToken)}`);
    req.userId = decodedToken.sub;
    return decodedToken.sub;
  }
  log.warn('No API Auth Token Found');

  return null;
};

const addUserToContext = async (req, userId, db) => {
  // console.log('User Middleware');
  // console.log(req);
  if (req.userId) {
    // req.user = await db.query.user({ where: { id: req.userId } }, '{ id name email permissions }');
    // console.log(`Authenticated User: ${jsonColorizer(req.user)}`);
  }
};

// Context passed down to GraphQL resolvers
const context = async (ctx) => {
  const userId = decodeJwt(ctx.req);
  await addUserToContext(ctx.req, userId, prisma);
  return {
    ...ctx,
    db: prisma,
  };
};

const playground = {
  workspaceName: process.env.APP_NAME,
  // See: https://github.com/prisma/graphql-playground#usage
  settings: {
    'editor.cursorShape': 'line',
    'editor.fontSize': 14,
    'editor.reuseHeaders': true,
    'editor.theme': 'dark',
    'prettier.printWidth': 100,
    'prettier.tabWidth': 2,
    'prettier.useTabs': false,
    'request.credentials': 'include',
    'schema.polling.enable': true,
    'schema.polling.endpointFilter': `*${process.env.BACKEND_URL}*`,
    'schema.polling.interval': 20000,
    'schema.disableComments': true,
    'tracing.hideTracingResponse': true,
  },
  // eslint-disable-next-line global-require
  tabs: require('./playground_tabs'),
};

// Create server
function createServer() {
  return new ApolloServer({
    schema,
    context,
    subscriptions: false,
    introspection: process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true',
    playground: (process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true') ? playground : false,
    debug: process.env.GRAPHQL_DEBUG === 'true',
    onHealthCheck: () => new Promise((resolve, reject) => {
      // Replace the `true` in this conditional with more specific checks!
      if (true) {
        resolve();
      } else {
        reject();
      }
    }),
  });
}

module.exports = createServer;
