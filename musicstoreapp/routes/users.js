module.exports = function (app, usersRepository) {
  app.get('/users', function (req, res) {
    res.send('lista de usuarios');
  })
  app.get('/users/signup', function (req, res) {
    res.render("signup.twig");
  })
  app.post('/users/signup', function (req, res) {
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');
    let user = {
      email: req.body.email,
      password: securePassword,
      role: req.body.role
    }
    //res.send('usuario registrado');
    usersRepository.insertUser(user).then(userId => {
      res.redirect("/users/login" +
          "?message=Nuevo usuario registrado"+
          "&messageType=alert-info ");
    }).catch(error => {
      res.redirect("error" +
          "?message=Error al registrar al usuario"
      );
    });
  });
  app.get('/users/login', function (req, res) {
    res.render("login.twig");
  })
  app.post('/users/login', function (req, res) {
    let securePassword = app.get('crypto').createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');
    let filter = {
      email: req.body.email,
      password: securePassword
    };
    let options = {};
    usersRepository.findUser(filter, options).then(user => {
      if (user == null) {
        req.session.user = null;
        res.redirect("/users/login" +
            "?message=Email o password incorrecto" +
            "&messageType=alert-danger ");
      } else {
        req.session.user = user.email;
        req.session.role = user.role;
        req.session.userId = user._id;
        res.redirect("/journeys/list");
      }
    }).catch(error => {
      req.session.user = null;
      res.redirect("error" +
          "?message=Error al iniciar sesion"
      );
    });
  });
  app.get('/users/logout', function (req, res) {
    req.session.destroy(err => {
      if (err) {
        console.log("Error: " + err);
      }
      res.redirect("/users/login");
    });
  })

}
