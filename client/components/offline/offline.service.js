'use strict';

angular.module('stalkApp')
  .factory('Offline', function Offline($rootScope, $http, $q) {

    return {
      listMessages : function(callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        
        $http.post('/api/messages',
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
