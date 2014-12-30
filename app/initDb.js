var
  db_helper = require('./backend_helpers/db_helper.js'),
  dbConn = db_helper.dbConn,
  account_helper = require('./backend_helpers/account_helper.js'),
  signUp = account_helper.signUp;

// Create users database

var usersDb = dbConn.database('users');
usersDb.create();

// Generate views for users database
usersDb.save('_design/users', {
  views: {
    all: {
      map: 'function (doc) { emit(null, doc) }'
    }
  }
});

// Create test admin account

signUp({
  username: 'admin',
  password: 'adminadmin',
  isAdmin: true
}, function (err) {
  if (err) console.error(err);
});

signUp({
  username: 'test',
  password: 'testtest',
  isAdmin: false
}, function (err) {
  if (err) console.error(err);
});