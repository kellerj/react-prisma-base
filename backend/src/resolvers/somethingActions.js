/**
 * Query and mutation resolvers for the `Something` datamodel object.
 * @module
 */
const { forwardTo } = require('prisma-binding');
const { getLogger } = require('../lib/logger');

const log = getLogger('somethingActions');

const Query = {

  something: forwardTo('db'),
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

const doSomethingElse = async (parent, args, ctx, info) => {
  log.info('Did Something Else');
  return { message: 'Got Something Else' };
};

const Mutation = {
  doSomething,
  doSomethingElse,
};

module.exports = {
  Query,
  Mutation,
};
