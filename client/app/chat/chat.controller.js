'use strict';

angular.module('withtalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth) {
    $scope.tabs = [];
    $scope.currentChannel = "";
    $scope.messageText = "";

    $scope.channelIdArray = {}; 
    $scope.waitingChannelArray = [];
    $scope.messages = {};
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
          $scope.tabs.push( {'C':channel, 'messages':[], 'NM': data.NM} );
          $scope.$apply();
        }
      });

      //init xpush
      $rootScope.xpush.on( 'message', function(channel, name, data){

        // currentChannel
        if( $scope.currentChannel == channel ){
          var searchInx = -1;
          for( var inx = 0 ; searchInx < 0 && inx < $scope.waitingChannelArray.length ; inx++){
            if( $scope.waitingChannelArray[inx].C == channel ){
              searchInx = inx;
            }
          }  

          data.MG  = decodeURIComponent( data.MG );

          var side = "left";
          var opposite = "right";
          if( data.UO.U == $scope.currentUser.uid ){
            side = "right";
            opposite = "left";
          }

          var time = $scope.timeToString( data.TS )[0];
          var newMessage = {userid: data.UO.NM, time:time, message:data.MG, side:side, opposite:opposite};
         
          if( searchInx > -1 ){
            $scope.tabs[searchInx].messages.push(newMessage);
            $scope.$broadcast("items_changed");
            $scope.$apply();
          }
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
      var msg = document.getElementById( "inputMessage" ).value;
      msg = encodeURIComponent(msg);

      var DT = { UO : { U : $scope.currentUser.uid, NM : $scope.currentUser.name}, MG : msg };

      $rootScope.xpush.send($scope.currentChannel, 'message', DT );
      document.getElementById( "inputMessage" ).value = "";
    };

    $scope.gotoChat = function( data ){
      $scope.currentChannel = data.C;
      var tab = document.getElementById( "tab_" + data.C );
      angular.element( tab ).parent().addClass("active");
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
