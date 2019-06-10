
require('dotenv-expand')(require('dotenv-safe').config());
const express = require('express');
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');

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
  console.log(`🚀 Server ready at http://localhost:${process.env.BACKEND_PORT}${apollo.graphqlPath}`);
});
