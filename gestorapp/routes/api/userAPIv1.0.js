
module.exports = function (app,usersRepository) {
    app.post('/api/v1.0/users/login', function (req, res) {
        try {
            let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            let filter = {
                dni: req.body.dni,
                password: securePassword
            }
            if (!filter.dni || filter.dni.trim() === '' || !req.body.password || req.body.password.trim() === '') {
                res.status(400);
                res.json({
                    message: "DNI o contraseña vacíos",
                    authenticated: false
                });
            }
            else{
                let options = {};
                usersRepository.findUser(filter, options).then(user => {
                    if (user == null) {
                        res.status(401); //Unauthorized
                        res.json({
                            message: "usuario no autorizado",
                            authenticated: false
                        })
                    } else {
                        let token = app.get('jwt').sign(
                            {user: user.dni, time: Date.now() / 1000},
                            "secreto");
                        res.status(200);
                        res.json({
                            message: "usuario autorizado",
                            authenticated: true,
                            token: token
                        })
                    }
                }).catch(error => {
                    res.status(401);
                    res.json({
                        message: "Se ha producido un error al verificar credenciales: " +error.message,
                        authenticated: false
                    })
                })
            }

        } catch (e) {
            res.status(500);
            res.json({
                message: "Se ha producido un error al verificar credenciales",
                authenticated: false
            })
        }
    })
}