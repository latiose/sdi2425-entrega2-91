const {ObjectId} = require("mongodb");
module.exports = function (app, usersRepository, logs) {
  app.get('/users', function (req, res) {
    res.send('lista de usuarios');
  })
  app.get('/users/signup', function (req, res) {
    res.render("signup.twig");
  })
  app.post('/users/signup', function (req, res) {

    const errors = {};


    if (!req.body.name || req.body.name.trim() === '') {
      errors.name = 'El nombre no puede estar vacío';
    }

    if (!req.body.lastName || req.body.lastName.trim() === '') {
      errors.lastName = 'El apellido no puede estar vacío';
    }


    const dni = req.body.dni;


    if (!dni || dni.trim() === '') {
      errors.dni = 'El DNI no puede estar vacío';
    } else {

      if (dni.length !== 9) {
        errors.dni = "Formato dni invalido";
      } else {

        const numberPart = dni.substring(0, 8);
        let numberPartValid = true;

        for (let i = 0; i < numberPart.length; i++) {
          if (isNaN(parseInt(numberPart[i]))) {
            numberPartValid = false;
            break;
          }
        }

        if (!numberPartValid) {
          errors.dni = "Formato dni invalido";
        } else {

          const lastChar = dni.charAt(dni.length - 1);
          const number = parseInt(numberPart);
          const letters = "TRWAGMYFPDXBNJZSQVHLCKE";

          if (isNaN(lastChar) === false || lastChar !== letters.charAt(number % 23)) {
            errors.dni = "Formato dni invalido";
          }
        }
      }
    }


    if (Object.keys(errors).length > 0) {
      return res.render("signup.twig", {
        errors: errors,
        user: req.body
      });
    }


    usersRepository.findUser({dni: dni}, {}).then(existingUser => {
      if (existingUser) {
        errors.dni = "Este DNI ya está registrado";
        return res.render("signup.twig", {
          errors: errors,
          user: req.body
        });
      }


      let password = generarContrasena(12);
      let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
          .update(password).digest('hex');
      let user = {
        dni: req.body.dni,
        name: req.body.name,
        lastName: req.body.lastName,
        password: securePassword,
        role: "EMPLOYEE"
      }
      usersRepository.insertUser(user).then(async userId => {
        await logs.logSignup(user);
        res.redirect("/journeys/list" +
            "?message=Nuevo usuario registrado. Password: " + password +
            "&messageType=alert-info ");
      }).catch(error => {
        res.redirect("error" +
            "?message=Error al registrar al usuario"
        );
      });
    }).catch(error => {
      res.redirect("error" +
          "?message=Error al verificar el DNI: " + error
      );
    });
  });

  app.get('/users/login', async function (req, res) {
    if (req.session.user) {
      res.redirect("/journeys/list");
    } else
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
    usersRepository.findUser(filter, options).then(async user => {
      if (user == null) {
        req.session.user = null;
        await logs.logLoginErr(req.body.dni);
        res.redirect("/users/login" +
            "?message=Dni o password incorrecto" +
            "&messageType=alert-danger ");
      } else {
        req.session.user = user.dni;
        req.session.name = user.name;
        req.session.lastName = user.lastName;
        req.session.role = user.role;
        req.session.userId = user._id;
        await logs.logLoginEx(req.session.user);
        res.redirect("/journeys/list");
      }
    }).catch(error => {
      req.session.user = null;
      req.session.name = null;
      req.session.lastName = null;
      req.session.role = null
      req.session.userId = null;
      res.redirect("error" +
          "?message=Error al iniciar sesion"
      );
    });
  });
  app.get('/users/logout', async function (req, res) {
    await logs.logLogout(req.session.user);
    req.session.destroy(err => {
      if (err) {
        console.log("Error: " + err);
      }
      res.redirect("/users/login");
    });
  });

  app.get('/employee/list', async function(req, res) {
    let page = parseInt(req.query.page) || 1;
    try {
      const result = await usersRepository.getUsersPaginated(page);

      let lastPage = Math.ceil(result.total / 5);
      if (result.total % 5 === 0 && result.total > 0) {
        lastPage = result.total / 5;
      }

      let pages = [];
      for (let i = page - 2; i <= page + 2; i++) {
        if (i > 0 && i <= lastPage) {
          pages.push(i);
        }
      }

      res.render("users/list.twig", {
        employees: result.users,
        pages: pages,
        currentPage: page
      });
    } catch (error) {
      res.render("users/list.twig", {
        errors: {error: "Se ha producido un error al listar los empleados: " + error.message}
      });
    }
  });

  app.get('/employee/edit/:id', async (req, res) => {
    let filter = { _id: new ObjectId(req.params.id) };
    usersRepository.findUser(filter, {}).then(employee => {
      res.render("users/edit.twig", { employee: employee });
    }).catch(error => {
      res.send("Se ha producido un error al recuperar el empleado " + error);
    });
  });

  app.post('/employee/edit/:id', async (req, res) => {
    const id = req.params.id;
    let userId;

    try {
      userId = new ObjectId(id);
    } catch (error) {
      return res.status(400).send('ID de empleado inválido');
    }
    const updatedEmployee = {
      dni: req.body.dni,
      name: req.body.name,
      lastName: req.body.lastName,
      role: req.body.role
    };

    const errors = {};

    if (!updatedEmployee.dni || updatedEmployee.dni.trim() === '') {
      errors.dni = 'El DNI no puede estar vacío';
    } else {
      // Validación del DNI
      const dni = updatedEmployee.dni;

      // Validar longitud del DNI
      if (dni.length !== 9) {
        errors.dni = "Formato dni invalido";
      } else {
        // Validar que los primeros 8 caracteres sean números
        const numberPart = dni.substring(0, 8);
        let numberPartValid = true;

        for (let i = 0; i < numberPart.length; i++) {
          if (isNaN(parseInt(numberPart[i]))) {
            numberPartValid = false;
            break;
          }
        }

        if (!numberPartValid) {
          errors.dni = "Formato dni invalido";
        } else {
          // Validar la letra del DNI
          const lastChar = dni.charAt(dni.length - 1);
          const number = parseInt(numberPart);
          const letters = "TRWAGMYFPDXBNJZSQVHLCKE";

          if (isNaN(lastChar) === false || lastChar !== letters.charAt(number % 23)) {
            errors.dni = "Formato dni invalido";
          }
        }
      }
    }

    if (!updatedEmployee.name || updatedEmployee.name.trim() === '') {
      errors.name = 'El nombre no puede estar vacío';
    }
    if (!updatedEmployee.lastName || updatedEmployee.lastName.trim() === '') {
      errors.lastName = 'El apellido no puede estar vacío';
    }

    try {
      const originalEmployee = await usersRepository.findUser({ _id: userId });

      if (!originalEmployee) {
        return res.status(404).send('Empleado no encontrado');
      }

      if (updatedEmployee.dni !== originalEmployee.dni && !errors.dni) {
        const existingUserWithDni = await usersRepository.findUserByDniExcludingId(updatedEmployee.dni, userId);

        if (existingUserWithDni) {
          errors.dni = 'Este DNI ya está registrado por otro empleado';
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.render('users/edit.twig', {
          employee: {
            _id: id,
            ...updatedEmployee
          },
          errors: errors
        });
      }

      const employeeToUpdate = {
        dni: updatedEmployee.dni,
        name: updatedEmployee.name,
        lastName: updatedEmployee.lastName,
        role: updatedEmployee.role
      };

      await usersRepository.updateUser(userId, employeeToUpdate);
      res.redirect('/employee/details/' + id);

    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      res.status(500).send('Error al procesar la solicitud: ' + error.message);
    }
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