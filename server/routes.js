/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function (app) {

  // Insert routes below
  app.use('/api/activitys', require('./api/activity'));
  app.use('/api/apps', require('./api/app'));
  app.use('/api/auths', require('./api/auth'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {

      console.log(path.resolve(app.get('appPath')));
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
