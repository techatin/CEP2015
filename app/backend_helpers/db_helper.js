var
  cradle = require('cradle'),
  dbConfig = require('../config.js').db;
  dbConn = new(cradle.Connection)('127.0.0.1', 5984, {
    cache: true,
    raw: false,
    forceSave: true,
    auth: { username: dbConfig.username, password: dbConfig.password }
  });

function docExists (db, doc, cb) {
  db.get(doc, function (err, doc) {
    if (err && err.error === 'not_found') return cb(null, false);
    if (!err && doc) return cb(null, true);
    return cb(err, null);
  });
}

function getDoc (db, doc, cb) {
  db.get(doc, function (err, doc) {
    if (err) return cb(err, null);
    return cb(null, doc);
  })
}

exports.dbConn = dbConn;
exports.docExists = docExists;
exports.getDoc = getDoc;