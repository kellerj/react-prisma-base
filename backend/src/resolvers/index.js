/* eslint-disable global-require */
const { extractFragmentReplacements } = require('prisma-binding');

const resolvers = {
  Query: require('./Query'),
  Mutation: require('./Mutation'),
  // AuthPayload: require('./resolvers/AuthPayload')
};

module.exports = {
  resolvers,
  fragmentReplacements: extractFragmentReplacements(resolvers),
};
