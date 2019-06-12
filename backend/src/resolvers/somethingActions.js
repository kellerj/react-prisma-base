/**
 * Query and mutation resolvers for the `Something` datamodel object.
 * @module
 */
const { forwardTo } = require('prisma-binding');

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
const doSomething = async (parent, args, ctx, info) => {
  // const item = await ctx.db.mutation.createItem({
  //   data: {
  //     ...args,
  //     user: { connect: { id: ctx.req.userId } },
  //   },
  // }, info);

  // console.log(item);

  // return item;
  console.log('Did Something');
  return { message: 'This Did Something' };
};

const Mutation = {
  doSomething,
};

module.exports = {
  Query,
  Mutation,
};
