'use strict';

var
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  account_helper = require('./backend_helpers/account_helper.js'),
  login = account_helper.login,
  signUp = account_helper.signUp,
  getUserInfo = account_helper.getUserInfo,
  getAllUsers = account_helper.getAllUsers,
  removeUser = account_helper.removeUser,
  updateUserInfo = account_helper.updateUserInfo;
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
      if (err && err.error !== 'not_found') {
        console.error(err);
        res.end(JSON.stringify({
          error: {
            message: err
          }
        }));
      }
      else if (!data || (err && err.error === 'not_found')) {
        res.end(JSON.stringify({
          error: {
            message: 'invalid username/password'
          }
        }));
      }
      else {
        getUserInfo(req.body.username, function (err, data) {
          if (err) {
            console.error(err);
            res.end(JSON.stringify({
              error: {
                message: err
              }
            }));
          }
          req.session.user = data;
          req.session.signedIn = true;
          res.end(JSON.stringify({
            error: null
          }));
        });
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
  });
  
  adminRouter.post('/adduser', jsonParser, function (req, res) {
    signUp({
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    }, function(err) {
      if (err) {
        console.error(err);
        res.end(JSON.stringify({
          error: {
            message: err
          }
        }));
      }
      else {
        res.end(JSON.stringify({
          error: null
        }));
      }
    });
  });
  
  adminRouter.post('/edituser', jsonParser, function (req, res) {
    updateUserInfo(req.body.username, req.body.fields, function(err, data) {
      if (err) {
        console.error(err);
        res.end(JSON.stringify({
          error: {
            message: err
          }
        }));
      }
      else {
        res.end(JSON.stringify({
          error: null
        }));
      }
    });
  });
  
  adminRouter.post('/removeuser', jsonParser, function (req, res) {
    removeUser(req.body.username, function(err, data) {
      if (err) {
        res.end(JSON.stringify({
          error: {
            message: err
          }
        }));
      }
      else {
        res.end(JSON.stringify({
          error: null
        }));
      }
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
  
  app.get('/loadFullAdminPanel', function (req, res) {
    var fullAdminPanelData = {};
    fullAdminPanelData.user = req.session.user;
    getAllUsers(function (err, data) {
      if (err) console.error(err);
      fullAdminPanelData.usersList = data;
      res.end(JSON.stringify(fullAdminPanelData));
    });
  });
  
  app.get('/loadUsersList', function (req, res) {
    var usersList = {};
    getAllUsers(function (err, data) {
      if (err) console.error(err);
      usersList.usersList = data;
      res.end(JSON.stringify(usersList));
    });
  });
  
  // Invalid Route
  app.all('*', function (req, res) {
    res.status(404).end('<h1>404: The Page/Resource Requested Is Not Found</h1>');
  });
}

module.exports = routes;