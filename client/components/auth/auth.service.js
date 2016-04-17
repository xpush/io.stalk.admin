'use strict';

angular.module('stalkApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};

    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      signUp: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/signup', {
          name: user.name,
          email: user.email
        }).
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      activate: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/activate', {
          uid: user.uid,
          email: user.email,
          password: user.password,
        }).
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      signUpDirect: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/signupdirect', {
          name: user.name,
          email: user.email,
          password: user.password
        }).
        success(function (data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function (err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },




      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
          success(function (data) {
            $cookieStore.put('token', data.token);

            currentUser = User.get();
            if( currentUser.language ){
              data.language = currentUser.language;   
            } else {
              data.language = 'ko';
            }

            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            this.logout();
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function () {
        $cookieStore.remove('token');
        currentUser = {};
      },
      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({id: currentUser._id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function () {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return currentUser.hasOwnProperty('email');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function (cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function () {
            cb(true);
          }).catch(function () {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function () {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function () {
        return $cookieStore.get('token');
      },

      /**
       * UpdateUser a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      updateUser: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.put('/api/auths/'+user.uid, user ).
          success(function (data) {
            currentUser = User.get();
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },
      /**
       * Get GEO Location by user ip
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      getGeoLocation: function (ip, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/geo/', {
          ip: ip
        }).
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      }
    };
  });
