const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');

const RULE_TRACING_ON = false;
/* eslint-disable no-unused-vars */
const {
  rule, shield, and, or, deny, not, allow,
} = require('graphql-shield');

const isAuthenticated = rule({
  cache: 'contextual',
})(async (parent, args, ctx, info) => !!ctx.req.userId);

const isAdmin = rule({
  cache: 'contextual',
})(async (parent, args, ctx, info) => {
  console.log('isAdmin Rule');
  return ctx.req.user && ctx.req.user.permissions && ctx.req.user.permissions.includes('ADMIN');
});

// const isItemOwner = rule({
//   cache: 'strict',
//   fragment: 'fragment ItemOwner on Item { id user { id } }',
// })(async (parent, args, ctx, info) => {
//   console.log('isItemOwner Rule');
//   return ctx.db.exists.Item({
//     id: args.id,
//     user: { id: ctx.req.userId },
//   });
// });

const logAndDeny = rule({
  cache: 'no_cache',
  debug: true,
})((parent, args, ctx, info) => {
  console.log('**************FALLBACK SHIELD RULE - INCOMPLETE RULE CONFIGURATION');
  console.log(`Unmatched GraphQL Request: ${jsonColorizer(stringify({
    parentType: info.parentType,
    returnType: info.returnType,
    fieldName: info.fieldName,
    operation: info.operation.operation,
    operationName: info.operation.name ? info.operation.name.value : info.operation,
    variableValues: info.variableValues,
  }, null, 2))}`);
  return false;
});

const traceAndDeny = rule({
  cache: 'no_cache',
  debug: true,
})((parent, args, ctx, info) => {
  if (RULE_TRACING_ON) {
    console.log('**************TRACE RULE');
    console.log(`GraphQL Request: ${jsonColorizer(stringify({
      parentType: info.parentType,
      returnType: info.returnType,
      fieldName: info.fieldName,
      operation: info.operation.operation,
      operationName: info.operation.name ? info.operation.name.value : info.operation,
      variableValues: info.variableValues,
    }, null, 2))}`);
    if (parent) {
      console.log(`Parent: ${jsonColorizer(stringify(parent, null, 2))}`);
    }
    console.log(`Args: ${jsonColorizer(stringify(args))}`);
    console.log(`Info: ${jsonColorizer(stringify(info, null, 2))}`);
  }
  return false;
});

module.exports = shield({
  Query: {
    getSomething: allow,
    // somethingElse: isAdmin,
  },
  Mutation: {
    doSomething: allow,
  },
  Something: allow,
  // AggregateSomething: allow,
},
{
  debug: process.env.NODE_ENV === 'development',
  allowExternalErrors: process.env.NODE_ENV === 'development',
  fallbackError: new Error('Unauthorized'),
  fallbackRule: logAndDeny,
});
