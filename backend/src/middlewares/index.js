/**
 * @module middlewares
 * @desc Include file to pull middlewares into the GraphQL setup.
 */
/* eslint-disable global-require */

const middlewares = [];

// Log the input as the first item
if (process.env.NODE_ENV === 'development') {
  middlewares.push(require('./loggers').logRequest);
}

// Other middlewares here
middlewares.push(require('./authorization'));
middlewares.push(require('./inputValidation'));

// log the result as the last item
if (process.env.NODE_ENV === 'development') {
  middlewares.push(require('./loggers').logRequestResult);
}

module.exports = middlewares;
