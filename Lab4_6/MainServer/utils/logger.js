const winston = require('winston');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: path.join(logDirectory, 'logs.log')
        })
    ]
});

module.exports = logger;
