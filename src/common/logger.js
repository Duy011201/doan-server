const logger = require('winston')

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

logger.addColors(colors)

const format = logger.format.combine(
    logger.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    logger.format.colorize({ all: true }),
    logger.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

const transports = [
    new logger.transports.Console(),
    new logger.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new logger.transports.File({ filename: 'logs/all.log' }),
]

const Logger = logger.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

module.exports = Logger