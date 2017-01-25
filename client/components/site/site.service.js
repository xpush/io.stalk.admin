'use strict';

angular.module('stalkApp')
  .factory('Site', function Auth($location, $rootScope, $http, $cookies, $q) {
    return {

      create: function (site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/apps', {
          name: site.name,
          url: site.url
        }).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },

      get: function (site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.get('/api/apps', {

        }).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },
      update: function (_site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.put('/api/apps/' + _site._id, _site
        ).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },
      remove: function (_site, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.delete('/api/apps/' + _site._id, _site
        ).then(function successCallback(response) {
            deferred.resolve(response);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      }
    }

  });