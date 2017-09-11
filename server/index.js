const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const colors = require('colors');

const config = require('./config/config');
const database = require('./config/database');

const app = express();

app.use(bodyParser.json()); // application/json
app.set('trust proxy', 1); // trust first proxy only on PROD
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat', // TODO: change secret
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000,
  },
}));
app.use((req, res, next) => {
  var hour = 1000 * 60 * 60;
  if(!req.session.init) {
    req.session.init = true;
    req.session.auth = {
      logged: false
    };
  }
  req.session.cookie.expires = new Date(Date.now() + hour);
  req.session.cookie.maxAge = hour;
  req.isAuthenticated = () => {
    return req.session.auth.logged;
  };
  return next();
});

database.initialize();

app.get('*', (req, res) => {
  res.send('hello world');
});

app.listen(config.port, () => {
  console.log((`App listen on port: ${config.port}`).green);
});
