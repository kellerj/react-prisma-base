const winston = require('winston');

const { loggers, format, transports } = winston;

const configuredLoggers = {};

const consoleFormat = format.combine(
  format.timestamp({ format: 'HH:mm:ss.SSS' }),
  // format.label({ label: 'server' }),
  format.colorize({ message: true }),
  format.printf((info) => `${info.timestamp} : ${info.label} : ${info.level.toUpperCase()} : ${info.message}`),
);

const fileFormat = format.combine(
  format.timestamp(),
  // format.label({ label: 'server' }),
  format.uncolorize(),
  format.printf((info) => `${info.timestamp} : ${info.label} : ${info.level.toUpperCase()} : ${info.message} ${info}`),
);

const addLabelToFormat = (label, fmt) => (format.combine(format.label({ label }), fmt));

const standardTransports = (label) => (
  [
    new transports.Console({
      format: addLabelToFormat(label, consoleFormat),
    }),
    new transports.File({
      tailable: true,
      maxFiles: 10,
      maxsize: 10 * 1024 * 1024,
      zippedArchive: true,
      filename: process.env.LOG_DIRECTORY,
      format: addLabelToFormat(label, fileFormat),
    }),
  ]
);

const addLogger = (label, defaultLevel) => {
  return loggers.add(label, {
    level: defaultLevel,
    format: addLabelToFormat(label, consoleFormat),
    transports: standardTransports(label),
  });
};

module.exports.getLogger = (moduleName) => {
  if ( !configuredLoggers[moduleName] ) {
    return addLogger(moduleName, 'info');
  }
  return configuredLoggers[moduleName];
};
