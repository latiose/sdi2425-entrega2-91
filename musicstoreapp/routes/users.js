module.exports = function (app, usersRepository) {
  app.get('/users', function (req, res) {
    res.send('lista de usuarios');
  })
  app.get('/users/signup', function (req, res) {
    res.render("signup.twig");
  })
  app.post('/users/signup', function (req, res) {
    let password = generarContrasena(12);
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(password).digest('hex');
    let user = {
      dni: req.body.dni,
      name: req.body.name,
      surname: req.body.surname,
      password: securePassword,
      role: "STANDARD"
    }
    //res.send('usuario registrado');
    usersRepository.insertUser(user).then(userId => {
      res.redirect("/users/login" +
          "?message=Nuevo usuario registrado. Password: " + password +
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
      dni: req.body.dni,
      password: securePassword
    };
    let options = {};
    usersRepository.findUser(filter, options).then(user => {
      if (user == null) {
        req.session.user = null;
        res.redirect("/users/login" +
            "?message=Dni o password incorrecto" +
            "&messageType=alert-danger ");
      } else {
        req.session.user = user.dni;
        req.session.name = user.name;
        req.session.surname = user.surname;
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
  });

  function generarContrasena(longitud = 12) {
    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiales = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const todo = mayusculas + minusculas + numeros + especiales;


    let contrasena = "";
    contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
    contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
    contrasena += numeros[Math.floor(Math.random() * numeros.length)];
    contrasena += especiales[Math.floor(Math.random() * especiales.length)];

    for (let i = contrasena.length; i < longitud; i++) {
      contrasena += todo[Math.floor(Math.random() * todo.length)];
    }

    contrasena = contrasena.split('').sort(() => Math.random() - 0.5).join('');
    return contrasena;
  }

}
