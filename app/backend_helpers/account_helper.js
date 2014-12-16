var
  bcrypt = require('bcrypt'),
  db_helper = require('./db_helper.js'),
  dbConn = db_helper.dbConn,
  docExists = db_helper.docExists,
  usersDb = dbConn.database('users');

function signUp (username, password, cb) {
  docExists(usersDb, username, function (err, data) {
    if (err) return cb(err, null);
    if (data === true) return cb ('Error: user already exists', null);
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return cb(err, null);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return cb(err, null);
        usersDb.save(username, {
          password: hash
        }, function (err, res) {
          return cb(err, res);
        });
      });
    });
  });
}

function login (username, password, cb) {
  usersDb.get(username, function (err, user) {
    if (err && err.error === 'not_found') return cb (null, false);
    if (err) return cb (err, false);
    bcrypt.compare(password, user.password, function (err, res) {
      return cb (err, res);
    })
  });
}

exports.login = login;
exports.signUp = signUp;