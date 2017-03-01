'use strict';

angular.module('stalkApp')
  .factory('Channel', function Channel($rootScope, $http, $q) {

    return {

      save: function (channel, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.put('/api/channels/save',
            channel
          ).
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
      close: function (channel, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/channels/close',
            channel
        ).then(function successCallback(response) {
              deferred.resolve(response.data);
              return cb();
        }, function errorCallback(response) {
              deferred.reject(response);
              return cb(response);
        });

        return deferred.promise;
      },
      list : function(callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/channels',
          {}
        ).then(function successCallback(response) {
              deferred.resolve(response.data);
              return cb();
        }, function errorCallback(response) {
              deferred.reject(response);
              return cb(response);
        });

        return deferred.promise;
      },
      search : function(param, callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/channels/search',
          param
        ).then(function successCallback(response) {
              deferred.resolve(response.data);
              return cb();
        }, function errorCallback(response) {
              deferred.reject(response);
              return cb(response);
        });

        return deferred.promise;
      }
    }
});
