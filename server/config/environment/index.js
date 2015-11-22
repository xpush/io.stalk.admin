'use strict';

var path = require('path');
var _ = require('lodash');
var argv = require('optimist').argv;

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}


// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  //ip: process.env.IP || '0.0.0.0',
  ip: '0.0.0.0',

  // Should we populate the DB with initial data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'stalk-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================

if (argv.config) {
  module.exports = _.merge(
    all,
    require(argv.config) || {});
} else {
  module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
}
