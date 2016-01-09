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
      list : function(callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        
        $http.post('/api/channels',
          {}
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
      }
    }
});