const Bindings = require('prisma-binding');
const Client = require('./generated/prisma-client');
const { fragmentReplacements } = require('./resolvers/index');

module.exports = {
  client: new Client.Prisma({
    fragmentReplacements,
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: process.env.PRISMA_DEBUG,
  }),
  bindings: new Bindings.Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    fragmentReplacements,
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: process.env.PRISMA_DEBUG,
  }),
};
