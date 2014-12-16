'use strict';

module.exports = routes;

var
  path = require('path'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  account_helper = require('./backend_helpers/account_helper.js'),
  login = account_helper.login,
  signUp = account_helper.signUp;

function routes (app) {
  app.get('/', function (req, res) {
    if (req.session.signedIn) res.redirect('/dashboard');
    else res.redirect('/login');
  });
  
  app.use(function (req, res, next) {
    if (req.path !== '/login') {
      if (!req.session.signedIn) res.redirect('/login');
      return next();
    }
    if (req.session.signedIn) res.redirect('/dashboard');
    return next();
  });
  
  app.get('/login', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/login.html'));
  });
  
  app.get('/dashboard', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/dashboard.html'));
  });

  app.post('/login', jsonParser, function (req, res) {
    login(req.body.username, req.body.password, function (err, data) {
      if (err) console.error(err);
      console.log(data);
      if (!data) res.end(JSON.stringify({ error: true }));
      else {
        req.session.user = req.body.username;
        req.session.signedIn = true;
        res.end(JSON.stringify({ error: false }));
      }
    });
  });
}