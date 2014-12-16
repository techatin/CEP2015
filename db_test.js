module.exports = test;

function test () {
  var cradle = require('cradle');
  var db_conn = new(cradle.Connection)('127.0.0.1', 5984, {
    cache: true,
    raw: false,
    forceSave: true
  });
  var db = db_conn.database('starwars');
  db.create();
}