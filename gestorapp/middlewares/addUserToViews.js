module.exports = function(req, res, next) {
    res.locals.user = {
        role: req.session.role,
        logged: !!req.session.user
    };
    next();
};