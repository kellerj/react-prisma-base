/**
 * Query and mutation resolvers for the `Something` datamodel object.
 * @module
 */
// const { forwardTo } = require('prisma-binding');
const { getLogger } = require('../lib/logger');
const encryption = require('../lib/encryption');

const log = getLogger('somethingActions');

const something = async (parent, args, ctx, info) => {
  log.info(`something: ${JSON.stringify(args)}`);
  const item = await ctx.db.query.something(args, info);
  item.encryptedData = encryption.decrypt(item.encryptedData);
  return item;
};

const Query = {

  something,
  // somethings: forwardTo('db'),
};

/**
 * Do something with the Something data.
 *
 * @param {*} parent Apollo parent object for the mutation
 * @param {*} args Arguments passed into the mutation
 * @param {*} ctx Apollo context
 * @param {*} info Apollo info
 * @returns {GeneralResult} The results of the mutation.
 */
// eslint-disable-next-line no-unused-vars
const doSomething = async (parent, args, ctx, info) => {
  // const item = await ctx.db.mutation.createItem({
  //   data: {
  //     ...args,
  //     user: { connect: { id: ctx.req.userId } },
  //   },
  // }, info);

  // console.log(item);

  // return item;
  log.info('Did Something');
  return { message: 'This Did Something' };
};

// eslint-disable-next-line no-unused-vars
const doSomethingElse = async (parent, args, ctx, info) => {
  log.info('Did Something Else');
  return { message: 'Got Something Else' };
};

const updateSomething = async (parent, args, ctx, info) => {
  log.info(`updateSomething: ${JSON.stringify(args)}`);

  // encrypt the field before sending it to Prisma/Mongo
  if (args.data.encryptedData) {
    args.data.encryptedData = encryption.encrypt(args.data.encryptedData);
  }
  const item = await ctx.db.mutation.updateSomething({
    where: args.where,
    data: args.data,
  }, info);
  // The above returns the encrypted data back from the database, need to decrypt it.
  if (item.encryptedData) {
    item.encryptedData = encryption.decrypt(item.encryptedData);
  }
  return item;
};


const Mutation = {
  doSomething,
  doSomethingElse,
  updateSomething,
};

module.exports = {
  Query,
  Mutation,
};
