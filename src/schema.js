const { makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { importSchema } = require('graphql-import');

const typeDefs = importSchema('./database/schema.graphql');
const { resolvers } = require('./resolvers/index');
const middlewares = require('./middlewares');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});
const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

module.exports = schemaWithMiddleware;
