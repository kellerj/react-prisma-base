const { forwardTo } = require('prisma-binding');

const Query = {
  // something: forwardTo('db'),
};

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // const item = await ctx.db.mutation.createItem({
    //   data: {
    //     ...args,
    //     user: { connect: { id: ctx.req.userId } },
    //   },
    // }, info);

    // console.log(item);

    // return item;
  },
};

module.exports = {
  Query,
  Mutation,
};
