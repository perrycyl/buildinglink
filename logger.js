const {createLogger, format, transports} = require('winston');

const myFormat = format.printf(info => {
    if(info instanceof Error) {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${info.stack}`;
    }
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'user-service' },
    timestamp: true,
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new transports.File({ 
        filename: 'errorlog', 
        format: format.combine(
            format.label({label: 'Pearbear'}),
            format.timestamp(),
            format.colorize(),
            format.errors({stack: true}),
            myFormat),
        level: 'error', 
        timestamp: true,
        json: true }),
      new transports.File({
        filename: 'mainlog', 
        format: format.combine(
            format.label({label: 'Pearbear'}),
            format.timestamp(),
            format.colorize(),
            format.errors({stack: true}),
            myFormat),
        timestamp: true,
        json: true}),
    ],
  });

module.exports = {
    logger
}