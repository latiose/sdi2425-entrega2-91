const jwt = require("jsonwebtoken");
const express = require('express');
const userTokenRouter = express.Router();
userTokenRouter.use(function (req, res, next) {
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', {}, function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.time) > 3600) {
                res.status(403); // Forbidden
                res.json({
                    authorized: false,
                    error: 'Token inválido o caducado'
                });
            } else {
                // dejamos correr la petición
                res.user = infoToken.user;
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({
            authorized: false,
            error: 'No hay Token'
        });
    }
});
module.exports = userTokenRouter;