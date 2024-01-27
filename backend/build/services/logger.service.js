import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const consoleFormat = format.combine(format.colorize(), format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`));
const fileFormat = format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`));
const dailyRotateFileTransport = new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    maxSize: '20m',
    maxFiles: '14d'
});
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    transports: [
        dailyRotateFileTransport,
        new transports.Console({
            format: consoleFormat,
        }),
    ],
});
export default logger;
//# sourceMappingURL=logger.service.js.map