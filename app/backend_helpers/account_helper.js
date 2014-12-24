var
  bcrypt = require('bcrypt'),
  db_helper = require('./db_helper.js'),
  dbConn = db_helper.dbConn,
  docExists = db_helper.docExists,
  getDoc = db_helper.getDoc,
  removeDoc = db_helper.removeDoc,
  updateDoc = db_helper.updateDoc,
  usersDb = dbConn.database('users');

function signUp (options, cb) {
  if (!options.username || options.username === '') return cb('Signup Error: username not provided');
  if (!options.password || options.username === '') return cb('Signup Error: password not provided');
  if (options.isAdmin === undefined) return cb('Signup Error: isAdmin not provided');
  if (!/^[a-z0-9]{3,16}$/i.test(options.username)) return cb('Signup Error: invalid username');
  if (!/^[\S]{8,24}$/i.test(options.password)) return cb('Signup Error: invalid password');
  
  var username = options.username;
  var password = options.password;
  var isAdmin = options.isAdmin;
  
  docExists(usersDb, username, function (err, exists) {
    if (err) return cb(err);
    if (exists) return cb ('Error: user already exists', null);
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return cb(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return cb(err);
        usersDb.save(username, {
          username: username,
          password: hash,
          isAdmin: isAdmin
        }, function (err, res) {
          if (err) return cb(err);
          cb(null);
        });
      });
    });
  });
}

function removeUser(username, cb) {
  removeDoc(usersDb, username, function(err, res) {
    return cb(err, res);
  });
}

function login(username, password, cb) {
  usersDb.get(username, function (err, user) {
    if (err) return cb (err, null);
    bcrypt.compare(password, user.password, function (err, res) {
      return cb (err, res);
    })
  });
}

function getUserInfo(username, cb) {
  getDoc(usersDb, username, function (err, data) {
    if (err) return cb(err, null);
    delete data._rev;
    delete data.password;
    delete data._id;
    return cb(null, data);
  });
}

function updateUserInfo(username, fields, cb) {
  updateDoc(usersDb, username, fields, function(err, res) {
    return cb(err, res);
  });
}

function getAllUsers(cb) {
  usersDb.view('users/all', function(err, res) {
    if (err) return cb(err, null);
    cb(null, res);
  })
}

exports.login = login;
exports.signUp = signUp;
exports.removeUser = removeUser;
exports.getUserInfo = getUserInfo;
exports.updateUserInfo = updateUserInfo;
exports.getAllUsers = getAllUsers;