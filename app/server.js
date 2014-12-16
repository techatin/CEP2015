'use strict';

var
  config = require('./config.js'),
  express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  compression = require('compression'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  favicon = require('serve-favicon'),
  morgan = require('morgan');

var
  port = config.serverPort,
  host = config.serverHost;
server.listen(port, host, function () {
  console.log("Server listening on " + host + ":" + port);
});

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(compression());
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(favicon(__dirname + '/../static/assets/favicon.ico'));
app.use(express.static(__dirname + '/../static/css', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/../static/js', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/../static/assets', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/../static/bower_components', { maxAge: 86400000 }));

app.use(function (req, res, next) {
  console.log(req.session);
  next();
});

require('./routes.js')(app, config);

// Signup for test account

/*var account_helper = require('./backend_helpers/account_helper.js');
var signUp = account_helper.signUp;
signUp('admin', 'admin', function (err, data) {
  if (err) console.error(err);
  console.log(data);
});*/