'use strict';

angular.module('withtalkApp')
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

      $http.get('/api/apps', {

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
  }

});


