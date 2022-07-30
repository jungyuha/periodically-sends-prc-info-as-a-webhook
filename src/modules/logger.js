/*http 로그*/
var winston = require('winston');
const { Console } = require('winston/lib/winston/transports');
const { combine, timestamp, printf } = winston.format;
const WinstonDaily = require('winston-daily-rotate-file');

  const localLogger = winston.createLogger({
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      printf(info => `[${info.timestamp}] ${info.message}`)
      ),
    transports: [
      new Console({
        level: 'http'
      }),
      new WinstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: 'log',
        filename: `%DATE%.log`,
        maxFiles: 30,  // 30일치 로그 파일 저장
        zippedArchive: true, 
      })
    ]
  });
  module.exports = localLogger;
