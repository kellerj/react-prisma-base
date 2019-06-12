/**
 * Master file for including GraphQL resolvers.
 *
 * @module
 */
/* eslint-disable global-require */
const { extractFragmentReplacements } = require('prisma-binding');

const resolvers = {
  Query: require('./Query'),
  Mutation: require('./Mutation'),
};

module.exports = {
  resolvers,
  fragmentReplacements: extractFragmentReplacements(resolvers),
};
