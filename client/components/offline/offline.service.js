'use strict';

angular.module('stalkApp')
  .factory('Offline', function Offline($rootScope, $http, $q) {

    return {
      listMessages : function(callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        
        $http.post('/api/messages',
          {}
        ).then(function successCallback(response) {
            deferred.resolve(response.data);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },
      readMessage: function(query, callback){

        var cb = callback || angular.noop;
        var deferred = $q.defer();
        
        $http.post('/api/messages/read',
          {id:query.id}
        ).then(function successCallback(response) {
            deferred.resolve(response.data);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      },
      readAllMessage: function(callback){

        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/messages/readAll',
          {}
        ).then(function successCallback(response) {
            deferred.resolve(response.data);
            return cb();
        }, function errorCallback(response) {
            deferred.reject(err);
            return cb(err);
        });

        return deferred.promise;
      }
    }
});
