/* eslint-disable no-unused-vars */
const {
  shield, and, or, not, inputRule,
} = require('graphql-shield');
const yup = require('yup');

const emailValidator = yup
  .string()
  .trim()
  .lowercase()
  .email('Must be an email address.');

module.exports = shield({
  Query: {
    // eslint-disable-next-line no-shadow
    something: inputRule(yup => yup.object({
      where: yup.object({
        code: yup.string().required(),
      }).required(),
    }).required()),
  },
  Mutation: {
  },
},
{
  debug: process.env.NODE_ENV === 'development',
  allowExternalErrors: process.env.NODE_ENV === 'development',
  fallbackError: 'Invalid Input',
  // fallbackRule: logAndDeny,
});
