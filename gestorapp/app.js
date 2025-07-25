const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');


let app = express();
let rest = require('request');
app.set('rest', rest);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, token");
  next();
});
let jwt = require('jsonwebtoken');
app.set('jwt', jwt);
let expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

let crypto = require('crypto');
app.set('clave','abcdefg');
app.set('crypto',crypto);
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const addUserToViews = require('./middlewares/addUserToViews');
app.use(addUserToViews);
app.use('/', indexRouter);
const { MongoClient } = require("mongodb");
const connectionStrings = "mongodb://localhost:27017/gestorapp";
const dbClient = new MongoClient(connectionStrings);
const initializeDatabase = require('./config/initDatabase');

const logsRepository = require("./repositories/logsRepository.js");
logsRepository.init(app, dbClient)
const logs = require("./middlewares/logger.js")(app, logsRepository);
app.use(logs.logRequest);

const userSessionRouter = require('./routes/userSessionRouter');
const userTokenRouter = require('./routes/userTokenRouter');

app.use("/api/v1.0/journeys/", userTokenRouter);
app.use("/api/v1.0/vehicles/", userTokenRouter);
app.use("/refuels", userSessionRouter);
app.use("/journeys/", userSessionRouter);
app.use("/vehicles/", userSessionRouter);
app.use("/employee/", userSessionRouter);
app.use("/logs/", userSessionRouter);
const adminSessionRouter = require('./routes/adminSessionRouter');
app.use("/users/signup", adminSessionRouter);
app.use("/vehicles/add", adminSessionRouter);
app.use("/vehicles/list", userSessionRouter);
app.use("/logs/", adminSessionRouter);
app.use("/employee/", adminSessionRouter);

app.use(express.static(path.join(__dirname, 'public')));


const usersRepository = require("./repositories/usersRepository.js");
const vehiclesRepository = require("./repositories/vehiclesRepository.js")
const journeysRepository = require("./repositories/journeysRepository.js")
journeysRepository.init(app,dbClient);
const refuelsRepository = require("./repositories/refuelsRepository.js");
refuelsRepository.init(app,dbClient);
vehiclesRepository.init(app, dbClient);
journeysRepository.init(app,dbClient);
usersRepository.init(app, dbClient);

require("./routes/refuels.js")(app, refuelsRepository, journeysRepository, vehiclesRepository);
require("./routes/vehicles.js")(app, vehiclesRepository, journeysRepository, usersRepository, refuelsRepository);
require("./routes/journeys.js")(app,journeysRepository,vehiclesRepository,usersRepository);
require("./routes/api/userAPIv1.0.js")(app,usersRepository);
require("./routes/api/journeysAPIv1.0.js")(app, journeysRepository,usersRepository,vehiclesRepository);
require("./routes/api/vehiclesAPIv1.0.js")(app, vehiclesRepository,usersRepository);
require("./routes/api/testAPI.js")(app, dbClient);
require("./routes/users.js")(app, usersRepository, logs);
require("./routes/logs")(app, logsRepository);

(async () => {
  try {
    await initializeDatabase(dbClient);
    console.log("Database initialized successfully with sample data");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
})();

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log("Se ha producido un error"+err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
