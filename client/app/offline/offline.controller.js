'use strict';

angular.module('stalkApp')
  .controller('OfflineCtrl', function ($rootScope, $scope, Auth, Offline, Util) {
    $scope.messages = [];

    Offline.listMessages().then(function (messages) {

      var results = [];
      for( var inx = 0 ; inx < messages.length ; inx++ ){
        var result = messages[inx];

        result.time = Util.timeToString( result.timestamp )[2];
        results.push( result );
      }

      $scope.messages = results;
    });
  });