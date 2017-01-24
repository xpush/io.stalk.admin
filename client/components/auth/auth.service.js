'use strict';

angular.module('stalkApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookies, $q) {
    var currentUser = {};

    if ($cookies.get('token')) {
      currentUser = User.get();
    }

    return {

      signUp: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/signup', {
          name: user.name,
          email: user.email
        }).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },

      activate: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/activate', {
          uid: user.uid,
          email: user.email,
          password: user.password
        }).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },

      signUpDirect: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/auths/signupdirect', {
          name: user.name,
          email: user.email,
          password: user.password
        }).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

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
        }).then(function successCallback(response) {

          var data = response.data;

          $cookies.put('token', response.data.token);

          currentUser = User.get();
          if( currentUser.language ){
            data.language = currentUser.language;   
          } else {
            data.language = 'ko';
          }

          deferred.resolve(data);
          return cb();
        }, function errorCallback(response) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        });

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function () {
        $cookies.remove('token');
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
        return $cookies.get('token');
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

        $http.put('/api/auths/'+user.uid, user )
        .then(function successCallback(response) {
            currentUser = User.get();
            deferred.resolve(response.data);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

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
        
        $http.get('/api/auths/geo/'+ip)
        .then(function successCallback(response) {
            deferred.resolve(response.data);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      }
    };
  });
