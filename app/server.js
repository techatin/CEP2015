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
  port = config.server.PORT,
  host = config.server.HOST;
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
app.use(express.static(__dirname + '/../static/css'));
app.use(express.static(__dirname + '/../static/js'));
app.use(express.static(__dirname + '/../static/assets'));
app.use(express.static(__dirname + '/../static/bower_components'));

require('./routes.js')(app);