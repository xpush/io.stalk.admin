'use strict';

angular.module('withtalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth) {

    $scope.currentChannel = "";

    $scope.channelIdArray = {}; 
    $scope.waitingChannelArray = [];
    $scope.messages = [];
    $scope.currentUser;
    $rootScope.isLogin=false;

    Auth.getCurrentUser().$promise.then(function(user) {
      $scope.currentUser = user;

      $rootScope.xpush.on( 'info', function(channel, name, data){
        var searchInx = -1;
        for( var inx = 0 ; searchInx < 0 && inx < $scope.waitingChannelArray.length ; inx++){
          if( $scope.waitingChannelArray[inx].C == channel ){
            searchInx = inx;
          }
        }
        if( searchInx == -1 ){
          $scope.channelIdArray[channel] = data;
          $scope.waitingChannelArray.push( data );
          $scope.$apply();
        }
      });

      //init xpush
      $rootScope.xpush.on( 'message', function(channel, name, data){

        // currentChannel
        if( $scope.currentChannel == channel ){

          data.MG  = decodeURIComponent( data.MG );

          var side = "left";
          var opposite = "right";
          if( data.UO.U == $scope.currentUser.uid ){
            side = "right";
            opposite = "left";
          }

          var time = $scope.timeToString( data.TS )[0];
          var newMessage = {userid: data.UO.NM, time:time, message:data.MG, side:side, opposite:opposite};

          $scope.messages.push(newMessage);
          $scope.$apply();
          $scope.$broadcast("items_changed")
        } else {
	  if( !$scope.channelIdArray[channel] ){
            //$scope.channelIdArray[channel] = true;
            //$scope.waitingChannelArray.push( {'C': channel } );
            //$scope.$apply();
          }
        }
      });

    }).catch(function() {
      console.log( '==== err =====' );
    });   

    $scope.sendMessage = function () {
      console.log( "===== send =====" );
      console.log($scope.messageText);
      var msg = $scope.messageText;

      var DT = { UO : { U : $scope.currentUser.uid, NM : $scope.currentUser.name}, MG : encodeURIComponent(msg) };

      $rootScope.xpush.send($scope.currentChannel, 'message', DT );
      $scope.messageText = "";
    };

    $scope.gotoChat = function( channelId ){
      $scope.currentChannel = channelId.C;
    };

    $scope.timeToString = function( timestamp ){

      var cDate = new Date();

      var cYyyymmdd = cDate.getFullYear()+""+(cDate.getMonth()+1)+""+cDate.getDate();
      var date = new Date( timestamp );

      var yyyy = date.getFullYear();
      var mm = date.getMonth()+1;
      var dd = date.getDate();

      var hour = date.getHours();
      hour = hour >= 10 ? hour : "0"+hour;

      var minute = date.getMinutes();
      minute = minute >= 10 ? ""+minute : "0"+minute;

      var second = date.getSeconds();
      second = second >= 10 ? ""+second : "0"+second;

      var yyyymmdd = yyyy + "" + mm + ""+ dd;

      var result = [];
      if ( cYyyymmdd != yyyymmdd  ) {
        result.push( yyyy + "-" + mm + "-"+ dd );
      } else {
        result.push( hour + ":" + minute + ":" +second );
      }

      result.push( yyyy + "." + mm + "."+ dd );
      result.push( date.toLocaleTimeString() );

      return result;
    };
  });


function currentTime(){
  var d = new Date;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var dd = d.getDate();
  var m = monthNames[d.getMonth()];
  var time = d.toLocaleTimeString().replace(/:\d+ /, ' ');


  return dd+" "+m+" "+time;

};
