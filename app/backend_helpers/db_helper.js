var
  cradle = require('cradle'),
  dbConfig = require('../config.js').db;
  dbConn = new(cradle.Connection)(dbConfig.HOST, dbConfig.PORT, {
    cache: false,
    raw: false,
    forceSave: true,
    auth: { username: dbConfig.username, password: dbConfig.password }
  });

function docExists (db, doc, cb) {
  db.get(doc, function(err, doc) {
    if (err && err.error === 'not_found') return cb(null, false);
    if (!err && doc) return cb(null, true);
    return cb(err, null);
  });
}

function getDoc (db, doc, cb) {
  db.get(doc, function(err, doc) {
    if (err) return cb(err, null);
    return cb(null, doc);
  })
}

function updateDoc(db, doc, fields, cb) {
  db.get(doc, function(err, doc) {
    if (err) return cb(err, null);
    for (var i=0; i<fields.length; ++i) {
      doc[fields[0].updatekey] = fields[0].updatevalue;
    }
    db.save(doc._id, doc._rev, doc, function(err, res) {
      return cb(err, res);
    });
  });
}

function removeDoc (db, doc, cb) {
  getDoc(db, doc, function(err, doc) {
    if (err) return cb(err, null);
    db.remove(doc._id, doc._rev, function(err, res) {
      cb(err, res);
    });
  });
}

exports.dbConn = dbConn;
exports.docExists = docExists;
exports.getDoc = getDoc;
exports.removeDoc = removeDoc;
exports.updateDoc = updateDoc;