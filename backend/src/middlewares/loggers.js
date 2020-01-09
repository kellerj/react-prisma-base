/* eslint-disable no-console */
/**
 * @module
 * @desc GraphQL request/response logging middleware
 * @memberof middlewares
 */
const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');
const { getLogger } = require('../lib/logger');

const log = getLogger('graphql');
// debugging logging to find things to include in traces below
// if (root) {
//   log.info(`Root: ${jsonColorizer(stringify(root, null, 2))}`);
// }
// log.info(`Info: ${jsonColorizer(stringify(info, null, 2))}`);
// log.info(`Context: ${jsonColorizer(stringify(context, null, 2))}`);

/**
 * Log the operation and arguments of the GraphQL call.
 *
 * @param {*} resolve Call to continue resolving the graphQL request.
 * @param {*} root Apollo internals for the request
 * @param {object} args Arguments passed into the request if needed.
 * @param {*} context Apollo internals for the request
 * @param {*} info Apollo internals with information on the operation being called
 */
const logRequest = async (resolve, root, args, context, info) => {
  log.info(`GraphQL Request: ${jsonColorizer(stringify({
    parentType: info.parentType,
    returnType: info.returnType,
    fieldName: info.fieldName,
    operation: info.operation.operation,
    operationName: info.operation.name ? info.operation.name.value : info.operation,
    variableValues: info.variableValues,
  }, null, 2))}`);
  log.info(`GraphQL Request Args: ${jsonColorizer(stringify(args))}`);
  return resolve(root, args, context, info);
};

const logRequestResult = async (resolve, root, args, context, info) => {
  const result = await resolve(root, args, context, info);
  if (result) {
    log.info(`GraphQL Result: ${jsonColorizer(stringify(result, null, 2))}`);
  } else {
    log.info(`GraphQL Result: ${result}`);
  }
  return result;
};

module.exports = {
  logRequest,
  logRequestResult,
};
