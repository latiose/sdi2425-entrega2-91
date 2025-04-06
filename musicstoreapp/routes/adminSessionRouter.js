const express = require('express');
const adminSessionRouter = express.Router();

adminSessionRouter.use(function(req, res, next) {
    if (req.session.user && req.session.role === 'ADMIN') {
        next();
    } else {
        res.status(403).redirect("/error?message=Acceso denegado: requiere privilegios de administrador");
    }
});

module.exports = adminSessionRouter;