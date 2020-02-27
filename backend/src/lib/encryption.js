/**
 *  The encryption module to encrypt/decrypt data using RSA algorithm
 */

const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const path = require('path');
const fs = require('fs');
const { getLogger } = require('./logger');

const log = getLogger('encryption');

//const { keyFormat, keyEncoding, rsaPublicKey, rsaPrivateKey } = nconf.get('encryption');
const keyPath = process.env.KEY_PATH;
const keyFormat = process.env.KEY_FORMAT || 'pkcs1';
const keyEncoding = process.env.KEY_ENCODING || 'pem';
const encryptionKeyId = process.env.KEY_CURR_ID;
const keyFiles = fs.readdirSync(keyPath, { encoding: 'utf8', withFileTypes: true });
const keys = {};

const parseRsaKeyString = (keyString, keyType) => {
  const key = new NodeRSA();
  const keyFTE = `${keyFormat}-${keyType}-${keyEncoding}`;
  return key.importKey(keyString, keyFTE).exportKey(keyFTE);
};


keyFiles.forEach((dirEntry) => {
  const file = path.join(keyPath, dirEntry.name);
  if (dirEntry.isFile() && file.endsWith('.public')) {
    log.info(`Reading Public Key ${file}`);
    const keyId = path.basename(file, '.public');
    const keyData = fs.readFileSync(file, 'utf8').trim();
    if (!keys[keyId]) {
      keys[keyId] = {};
    }
    keys[keyId].publicPEM = keyData;
    keys[keyId].public = parseRsaKeyString(keyData, 'public');
  } else if (dirEntry.isFile() && file.endsWith('.private')) {
    log.info(`Reading Private Key ${file}`);
    const keyId = path.basename(file, '.private');
    const keyData = fs.readFileSync(file, 'utf8').trim();
    if (!keys[keyId]) {
      keys[keyId] = {};
    }
    keys[keyId].privatePEM = keyData;
    keys[keyId].private = parseRsaKeyString(keyData, 'private');
  }
});

// console.log(keys);
// TODO: fail when encryption key not set
// TODO: prepend the encryption key ID - use pipe delim
function encrypt(text, padding) {
  if (!text || !keys[encryptionKeyId].public) {
    return text;
  }
  const buffer = Buffer.from(text);
  const key = { key: keys[encryptionKeyId].public };
  if (padding) key.padding = crypto.constants[padding];
  const encrypted = crypto.publicEncrypt(key, buffer);
  return encrypted.toString('base64');
}

function decrypt(text, padding) {
  if (!text || !keys[encryptionKeyId].private) {
    return text;
  }
  const buffer = Buffer.from(text, 'base64');
  const key = { key: keys[encryptionKeyId].private };
  if (padding) key.padding = crypto.constants[padding];
  const decrypted = crypto.privateDecrypt(key, buffer);
  return decrypted.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt,
};
