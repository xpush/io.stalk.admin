'use strict';

angular.module('stalkApp')
  .factory('Site', function Auth($location, $rootScope, $http, $cookieStore, $q) {
    return {

      create: function (site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/apps', {
          name: site.name,
          url: site.url
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

      get: function (site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.get('/api/apps', {}).
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
      update: function (_site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.put('/api/apps/' + _site._id, _site).
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
      remove: function (_site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.delete('/api/apps/' + _site._id, _site).
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
    }

  });


