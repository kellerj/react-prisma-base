/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { generateKeyPairSync } = require('crypto');

const keyId = process.argv[2];
console.log(`Creating KeyPair for ID: ${keyId}`);
console.log('Using Environment variable KEY_PASSPHRASE to encrypt the private key.');

const keypair = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: process.env.KEY_PASSPHRASE,
  },
});
// console.log(keypair);
const keyPath = path.resolve(process.env.KEY_PATH);
fs.writeFileSync(path.join(keyPath, `${keyId}.private`), keypair.privateKey, 'utf8');
fs.writeFileSync(path.join(keyPath, `${keyId}.public`), keypair.publicKey, 'utf8');
console.log(`Key Files output to ${keyPath}`);
