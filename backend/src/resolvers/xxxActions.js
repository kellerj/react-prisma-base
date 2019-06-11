const { forwardTo } = require('prisma-binding');

const Query = {
  getSomething: forwardTo('db'),
};

const Mutation = {
  async doSomething(parent, args, ctx, info) {
    // const item = await ctx.db.mutation.createItem({
    //   data: {
    //     ...args,
    //     user: { connect: { id: ctx.req.userId } },
    //   },
    // }, info);

    // console.log(item);

    // return item;
    return { message: 'This Did Something' };
  },
};

module.exports = {
  Query,
  Mutation,
};
