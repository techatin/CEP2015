'use strict';

var 
  express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  compression = require('compression'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  favicon = require('serve-favicon'),
  morgan = require('morgan');

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log("Server listening on port " + port);
});

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(compression());
app.use(cookieParser());
app.use(session({
  secret: 'owm24wds0FdGsm92Aaf9mS6h0ll1DkSju20h9n200hhDFbJnLAchS0',
  resave: false,
  saveUninitialized: true
}));
app.use(favicon(__dirname + '/static/assets/favicon.ico'));
app.use(express.static(__dirname + '/static', { maxAge: 86400000 }));

require('./routes.js')(app);
require('./db_test.js')();