/**
 *  Encryption module to encrypt/decrypt data using RSA public/private key encryption.
 *
 * The public key is used to encrypt the values.  Private key is used to perform the decryption.
 *
 * Encrypted values are base-64 encoded and prefixed with the identity of the key used to encrypt it.
 * This prefix is used during the decryption process to select the needed key.
 *
 * Environment Variables Required:
 * KEY_PATH: Reletive or absolute path to a directory with the key files.  Files in this directory must be named with `.public` or `.private` extensions.  Other files _may_ be present in the directory.
 * KEY_CURR_ID: The ID of the current encryption key.  It will be used to encrypt any new data or reencrypt existing data.
 *
 * Key rotation can be accomplished by adding a new set of keys to the project and
 * updating the KEY_CURR_ID to the new ID.  This will cause all existing data to be
 * read and decrypted using the keys they were encrypted with.  Any data written back
 * and passed through the encryption function will be encrypted with the new key.
 *
 * Full re-keying of the data in an application would need to be a custom process for
 * each application.  It can utilize the `reencrypt` function for this activity.
 *
 * @module encryption
 */
/* eslint-disable no-param-reassign */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { getLogger } = require('./logger');

const log = getLogger('encryption');

// Path to the key files
const keyPath = path.resolve(process.env.KEY_PATH);
// key used to encrypt data
const encryptionKeyId = process.env.KEY_CURR_ID;
// Memory struct to hold read keys
const keys = {};
const DEFAULT_PADDING = 'PKCS1_OAEP';

/**
 * Constants to use when passing the padding to the encrypt function.
 *
 * @readonly
 * @enum
 */
const PaddingOption = {
  NONE: 'RSA_NO_PADDING',
  PKCS1: 'RSA_PKCS1_PADDING',
  PKCS1_OAEP: 'RSA_PKCS1_OAEP_PADDING',
};

/**
 * Reads in the files in the KEY_PATH directory and updates the in-memory structure
 * which associates them with their IDs.  The ID is taken from the file name before
 * the .public/.private extension.
 */
function initializeKeys() {
  if (!encryptionKeyId) {
    log.error('No encryption key ID set.  KEY_CURR_ID not set.');
    throw new Error('No encryption key ID set.  KEY_CURR_ID not set.');
  }

  const keyFiles = fs.readdirSync(keyPath, { encoding: 'utf8', withFileTypes: true });
  keyFiles.forEach((dirEntry) => {
    const file = path.join(keyPath, dirEntry.name);
    if (dirEntry.isFile() && file.endsWith('.public')) {
      log.info(`Reading Public Key ${file}`);
      const keyId = path.basename(file, '.public');
      const keyData = fs.readFileSync(file, 'utf8').trim();
      if (!keys[keyId]) {
        keys[keyId] = {};
      }
      keys[keyId].public = keyData;
    } else if (dirEntry.isFile() && file.endsWith('.private')) {
      log.info(`Reading Private Key ${file}`);
      const keyId = path.basename(file, '.private');
      const keyData = fs.readFileSync(file, 'utf8').trim();
      if (!keys[keyId]) {
        keys[keyId] = {};
      }
      keys[keyId].private = keyData;
    }
  });

  log.info('Loaded Keys:');
  Object.entries(keys).forEach(([key, value]) => {
    log.info(`Key ID: ${key} hasPublicKey=${!!value.public} hasPrivateKey=${!!value.private}`);
  });
  log.info(`Encryption Key Id: ${encryptionKeyId}`);

  if (!keys[encryptionKeyId] || !keys[encryptionKeyId].public) {
    log.error(`No public key found for the encryption key ID set (${encryptionKeyId}).`);
    throw new Error(`No public key found for the encryption key ID set (${encryptionKeyId}).`);
  }
}

/**
 * Encrypts the given value using the current encryption key.  Result it base-64 encoded and
 * prefixed with the encryption key and padding rules.
 *
 * @param {string} text
 * @param {PaddingOption} padding
 * @returns encrypted string including key ID and padding info
 */
function encrypt(text, padding) {
  if (!text) return text;

  const buffer = Buffer.from(text);
  if (!padding) padding = PaddingOption[DEFAULT_PADDING];
  // eslint-disable-next-line dot-notation
  const key = { key: keys[encryptionKeyId].public, padding: crypto.constants[padding] };
  const encrypted = crypto.publicEncrypt(key, buffer);
  // prepend the current encryption key and padding to the string
  // Using a Pipe character is safe as it is not a possible character in a base64 encoded string
  return `${encryptionKeyId}|${padding}|${encrypted.toString('base64')}`;
}

/**
 * Decrypt the given value given the key prepended to the base-64 encoded encrypted string.
 *
 * If no key ID is provided in the string, then it will attempt to decrypt with the current
 * default key as per the KEY_CURR_ID environment variable.
 *
 * @param {string} text
 * @returns decrypted string
 * @throws If the given encryption key in the passed value does not exist.
 */
function decrypt(text) {
  if (!text) return text;
  const data = text.split('|');
  let keyId = encryptionKeyId; // default in case the encrypted data does not have a prefix yet
  let padding = 'NONE';
  let buffer = null;
  if (data.length === 1) {
    buffer = Buffer.from(data[0], 'base64');
  } else {
    [keyId, padding] = data;
    buffer = Buffer.from(data[2], 'base64');
  }

  if (!keys[keyId] || !keys[keyId].private) {
    log.error(`Unable to decrypt.  No private key found for Key ID: ${keyId}`);
    throw new Error(`Server Misconfiguration - missing decryption key with ID ${keyId}`);
  }
  const key = { key: keys[encryptionKeyId].private, padding: crypto.constants[PaddingOption[padding]] };
  const decrypted = crypto.privateDecrypt(key, buffer);
  return decrypted.toString('utf8');
}

function reencrypt(text, padding) {
  const decryptedValue = decrypt(text);
  return encrypt(decryptedValue, padding);
}

initializeKeys();

// Verify encryption Configuration
log.info('Running Encryption Test using Default Key.  Plaintext: "test string"');
const encryptedValue = encrypt('test string');
log.info(`Encrypted: "${encryptedValue}"`);
const decryptedValue = decrypt(encryptedValue);
log.info(`Decrypted: "${decryptedValue}"`);

module.exports = {
  encrypt,
  decrypt,
  reencrypt,
  PaddingOption,
};
