'use strict';

module.exports = routes;

var
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json();

function routes (app) {
  app.get('/', function (req, res){
    res.redirect('/login.html');
  });

  app.post('/login.html', jsonParser, function (req, res){
    console.log(req.body);
    res.end(JSON.stringify({ error: false }));
  });
}