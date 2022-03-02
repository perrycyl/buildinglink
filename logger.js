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
            format.prettyPrint(),
            format.label({label: 'Pearbear'}),
            format.timestamp(),
            format.colorize(),
            format.errors({stack: true}),
            myFormat),
        fexceptionHandlers: true,
        level: 'error', 
        timestamp: true,
        json: true }),
      new transports.File({
        filename: 'mainlog', 
        format: format.combine(
            // errorHunter(),
            // errorPrinter(),
            // logform.format.printf(info => `${info.level}: ${info.message}`),
            format.errors({stack: true}),
            format.label({label: 'Pearbear'}),
            format.timestamp(),
            format.colorize(),
            myFormat
            ),
        timestamp: true,
        json: true}),
    ],
    exceptionHandlers: [
      new transports.File(
        { 
          filename: 'exceptionlog',
          format: format.combine(
            format.prettyPrint(),
            format.label({label: 'Pearbear'}),
            format.timestamp(),
            format.colorize(),
            format.errors({stack: true}),
            myFormat),
          timestamp: true,
          json: true
        }
      )
    ]
  });

module.exports = {
    logger
}