const log4js = require('log4js');

module.exports = function(app, logsRepository) {

    log4js.configure({
        appenders: {
            console: { type: 'console' }
        },
        categories: {
            default: { appenders: ['console'], level: 'info' }
        }
    });

    const logger = log4js.getLogger();

    // Cuando hay parámetros, req.params solo se asigna cuando se ejecuta el handler
    // por ejemplo /journeys/vehicle/:id
    // Así que usando req.params directamente no nos sale nada (está vacío)
    // Usando res.end, se sustituye el res.end de la llamada por esta función y cuando termina
    // (cuando se llama a res.render desde journeys.js) se ejecuta este código
    // para poder tener req.params con la información correcta
    const logRequest = (req, res, next) => {
        const originalEnd = res.end;

        res.end = function(chunk, encoding) {
            const log = {
                type: 'PET',
                timestamp: new Date(),
                description: `${req.method} ${req.url} | parámetros: ${JSON.stringify(req.params)} body: ${JSON.stringify(req.body)}`,
            };

            registerLog(log).catch(err => {
                logger.error('Error al registrar la petición: ', err);
            });

            originalEnd.call(this, chunk, encoding);
        };

        next();
    };

    const registerLog = async function(log) {
        try {
            await logsRepository.insertLog(log);
            logger.info(`Log registrado: [${log.type}] - ${log.description}`);
        } catch (error) {
            logger.error('Error al registrar la petición: ', error);
        }
    };

    return {
        logRequest,
        logSignup: async (user) => {
            await registerLog({
                type: 'ALTA',
                timestamp: new Date(),
                description: `POST /users/signup | parámetros: {} body: ${JSON.stringify({ dni: user.dni, name: user.name, surname: user.surname })}`
            });
        },
        logLoginEx: async (dni) => {
            await registerLog({
                type: 'LOGIN-EX',
                timestamp: new Date(),
                description: `Inicio de sesión válido | DNI: ${dni}`
            });
        },
        logLoginErr: async (dni) => {
            await registerLog({
                type: 'LOGIN-ERR',
                timestamp: new Date(),
                description: `Intento fallido de inicio de sesión | DNI: ${dni}`
            });
        },
        logLogout: async (dni) => {
            await registerLog({
                type: 'LOGOUT',
                timestamp: new Date(),
                description: `Cierre de sesión | DNI: ${dni}`
            });
        }
    };

}