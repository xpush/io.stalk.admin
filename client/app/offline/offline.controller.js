'use strict';

angular.module('stalkApp')
  .controller('OfflineCtrl', function ($rootScope, $scope, Auth, Offline, Util) {
    $scope.timelines = [];

    Offline.listMessages().then(function (messages) {

      var result = {};
      var beforeDate = "";
      for( var inx = 0 ; inx < messages.length ; inx++ ){
        var message = messages[inx];

        var dts = Util.timeToString( message.timestamp );
        var date = dts[1];
        message.date = date;
        message.time = dts[2];

        if( !result[date] ){
          result[date] = {};
          result[date].date = date;
          result[date].messages = [];
        }

        result[date].messages.push( message );
      }

      console.log( result );

      $scope.timelines = result;
    });
  });