const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const jsonColorizer = require('json-colorizer');

const prisma = require('./prisma').bindings;
const schema = require('./schema');

const decodeJwt = (req) => {
  console.log('JWT Middleware');
  // console.log(req);
  const { token } = req.cookies;
  console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
  console.log(`JWT Token: ${token}`);
  if (token) {
    const decodedToken = jwt.verify(token, process.env.APP_SECRET);
    console.log(`Decoded Token: ${jsonColorizer(decodedToken)}`);
    req.userId = decodedToken.userId;
    return decodedToken.userId;
  }
  return null;
};

const addUserToContext = async (req, userId, db) => {
  console.log('User Middleware');
  // console.log(req);
  if (req.userId) {
    req.user = await db.query.user({ where: { id: req.userId } }, '{ id name email permissions }');
    console.log(`Authenticated User: ${jsonColorizer(req.user)}`);
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
    'request.credentials': 'same-origin',
    'schema.polling.enable': true,
    'schema.polling.endpointFilter': `*${process.env.BACKEND_URL}*`,
    'schema.polling.interval': 20000,
    'schema.disableComments': true,
    'tracing.hideTracingResponse': true,
  },
  tabs: [
//     {
//       endpoint: process.env.BACKEND_URL,
//       name: 'Tab Label',
//       query: `mutation {
//   mutationName {
//     message
//   }
// }
//       `,
//       responses: ['{}'],
//     },
  ],
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
  });
}

module.exports = createServer;
