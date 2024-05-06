const winston = require('winston');
const path = require('path');
const { format } = winston;

const logDirectory = path.join(__dirname, '../logs');

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), 
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: path.join(logDirectory, 'logs.log')
        })
    ]
});

module.exports = logger;
