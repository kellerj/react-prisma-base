/* eslint-disable no-console */
/**
 * @module
 * @desc Authorization middleware controlling access to GraphQL endpoints
 * @memberof middlewares
 */
const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');
const { getLogger } = require('../lib/logger');

const log = getLogger('authorization');

const RULE_TRACING_ON = false;
/* eslint-disable no-unused-vars */
const {
  rule, shield, and, or, deny, not, allow,
} = require('graphql-shield');

/**
 * Checks whether the request contains an authenticated `userId`
 * @func
 */
const isAuthenticated = rule({
  cache: 'contextual',
})(async (parent, args, ctx, info) => (
  !!ctx.req.userId || 'You must be logged in to perform this action.'
));

const isAdmin = rule({
  cache: 'contextual',
})(async (parent, args, ctx, info) => {
  log.debug('isAdmin Rule');
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
  log.error('**************FALLBACK SHIELD RULE - INCOMPLETE RULE CONFIGURATION');
  log.error(`Unmatched GraphQL Request: ${jsonColorizer(stringify({
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
    log.debug('**************TRACE RULE');
    log.debug(`GraphQL Request: ${jsonColorizer(stringify({
      parentType: info.parentType,
      returnType: info.returnType,
      fieldName: info.fieldName,
      operation: info.operation.operation,
      operationName: info.operation.name ? info.operation.name.value : info.operation,
      variableValues: info.variableValues,
    }, null, 2))}`);
    if (parent) {
      log.debug(`Parent: ${jsonColorizer(stringify(parent, null, 2))}`);
    }
    log.debug(`Args: ${jsonColorizer(stringify(args))}`);
    log.debug(`Info: ${jsonColorizer(stringify(info, null, 2))}`);
  }
  return false;
});

module.exports = shield({
  Query: {
    something: allow,
  },
  Mutation: {
    doSomething: allow,
    doSomethingElse: isAuthenticated,
  },
  // Each property on an object is checked.  You must be allowed to call the Query or Mutation *AND* access the resulting properties.
  // These could be expanded to allow access to attribute-level restrictions.
  Something: allow,
  GeneralResult: allow,
  // AggregateSomething: allow,
},
{
  debug: process.env.NODE_ENV === 'development',
  allowExternalErrors: process.env.NODE_ENV === 'development',
  fallbackError: new Error('Unauthorized'),
  fallbackRule: logAndDeny,
});
