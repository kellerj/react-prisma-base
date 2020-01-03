const Cryptr = require('cryptr');


const replaceEncryptedValues = (config) => {
  // this key can not be set via a .env file
  let cryptr;

  const decrypt = (envValue) => {
    // look for strings with format ENC(encrypted value)
    const matches = envValue.match(/^ENC\(([^)]+)\)$/) || [];
    if (matches.length < 2) {
      return envValue;
    }
    // we are lazy loading so that if there are no encrypted values, you
    // don't need to have APP_CONFIG_KEY defined
    if (!cryptr) {
      cryptr = new Cryptr(process.env.APP_CONFIG_KEY);
    }
    return cryptr.decrypt(envValue);
  };

  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const configKey in config.parsed) {
    process.env[configKey] = decrypt(config.parsed[configKey]);
  }

  return config;
};

module.exports = replaceEncryptedValues;
