'use strict';

var
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  account_helper = require('./backend_helpers/account_helper.js'),
  login = account_helper.login,
  signUp = account_helper.signUp,
  getUserInfo = account_helper.getUserInfo;
  //db_helper = require('./backend_helpers/db_helper.js');

function routes (app) {
  
  var adminRouter = express.Router();
  
  // Redirect to login page if not signed in
  app.all('*', function (req, res, next) {
    if (req.path !== '/login' && !req.session.signedIn) {
      res.redirect('/login');
    }
    else {
      next();
    }
  });

  // Redirect from '/' to dashboard page
  app.get('/', function (req, res) {
    res.redirect('/dashboard');
  });
  
  // Login routes
  app.route('/login')
  
  .all(function (req, res, next) {
    if (req.session.signedIn) {
      res.redirect('/dashboard');
    }
    else {
      next();
    }
  })
  
  .get(function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/html/login.html'));
  })
  
  .post(jsonParser, function (req, res) {
    login(req.body.username, req.body.password, function (err, data) {
      if (err) console.error(err);
      if (!data) res.end(JSON.stringify({ error: true }));
      else {
        getUserInfo(req.body.username, function (err, data) {
          if (err) console.error(err);
          req.session.user = data;
        });
        req.session.signedIn = true;
        res.end(JSON.stringify({ error: false }));
      }
    });
  });
  
  // Dashboard routes
  app.get('/dashboard', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/html/dashboard.html'));
  });
  
  // Admin routes
  app.use('/admin', adminRouter);
  
  adminRouter.use(function(req, res, next) {
    if (!req.session.user.isAdmin) {
      res.redirect('/dashboard');
      return;
    }
    next();
  });
  
  adminRouter.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/html/admin.html'))
  })
  
  adminRouter.post('/adduser', jsonParser, function (req, res) {
    signUp({
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    }, function(err) {
      if (err === 'Error: user already exists') res.end(JSON.stringify({ error: true }));
      else res.end(JSON.stringify({ error: false }));
    });
  });
  
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
  });
  
  // JSON API Server
  
  app.get('/loadDashboard', function (req, res) {
    res.end(JSON.stringify(req.session.user));
  });
  
  // Invalid Route
  app.all('*', function (req, res) {
    res.status(404).end('<h1>404: The Page/Resource Requested Is Not Found</h1>');
  });
}

module.exports = routes;