const log4js = require('log4js');

module.exports = function(app, logsRepository) {
    log4js.configure({
        appenders: {
            console: { type: 'console' }
        },
        categories: {
            default: { appenders: ['console', 'file'], level: 'info' }
        }
    });

    const logger = log4js.getLogger();

    const requestLogger = async (req, res, next) => {
        const log = {
            type: 'PET',
            timestamp: new Date(),
            description: `${req.method} ${req.url} | parámetros: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`,
        };

        try {
            await logsRepository.insertLog(log);
            logger.info(`Log registrado: [${log.type}] - ${log.description}`);
        } catch (error) {
            logger.error('Error al registrar la petición: ', error);
        }
    };

    const logSignup = async (req, res, next) => {
        const log = {
            type: 'ALTA',
            timestamp: new Date(),
            description: `${req.method} ${req.url} | parámetros: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`,
        };

        try {
            await logsRepository.insertLog(log);
            logger.info(`Log registrado: [${log.type}] - ${log.description}`);
        } catch (error) {
            logger.error('Error al registrar la petición: ', error);
        }
    }

    const logLoginEx = async function (req, res, next) {
        const log = {
            type: 'LOGIN-ERR',
            timestamp: new Date(),
            description: `${req.method} ${req.url} | parámetros: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`,
        };
    }

}