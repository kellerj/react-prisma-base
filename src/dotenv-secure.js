const Jasypt = require('jasypt');

const jasypt = new Jasypt();

const replaceEncryptedValues = (config) => {
  const decrypt = (envValue) => {
    // look for strings with format ENC(encrypted value)
    const matches = envValue.match(/^ENC\(([^)]+)\)$/) || [];
    if (matches.length < 2) {
      return envValue;
    }
    //console.debug(`Found Encrypted Value: ${matches[1]}`);
    // we doing this here so that if there are no encrypted values, you
    // don't need to have APP_CONFIG_KEY defined
    // this key can not be set via a .env file
    jasypt.setPassword(process.env.APP_CONFIG_KEY);
    return jasypt.decrypt(matches[1]);
  };

  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const configKey in config.parsed) {
    //console.debug(`Processing ${configKey}=${config.parsed[configKey]}`);
    config.parsed[configKey] = decrypt(config.parsed[configKey]);
    process.env[configKey] = config.parsed[configKey];
  }

  return config;
};

module.exports = replaceEncryptedValues;
