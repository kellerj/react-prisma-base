/* eslint-disable no-console */
const Jasypt = require('jasypt');

const jasypt = new Jasypt();

if (!process.env.APP_CONFIG_KEY) {
  console.log('Env Var APP_CONFIG_KEY must be set to the encryption key.');
  process.exit(-1);
}

if (process.argv.length < 3) {
  console.log('Pass in the value to encrypt on the command line.');
  process.exit(-1);
}
const configValue = process.argv[2];
console.log('Encrypting given value using the key in process.env.APP_CONFIG_KEY');

jasypt.setPassword(process.env.APP_CONFIG_KEY);
console.log(`ENC(${jasypt.encrypt(configValue)})`);
