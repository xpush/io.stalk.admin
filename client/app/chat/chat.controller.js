'use strict';

angular.module('withtalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth) {

    $scope.currentChannel = "123123123";

    $scope.waitingChannelArray = [];
    $scope.messages = [];
    $scope.currentUser;
    $rootScope.isLogin=false;

    Auth.getCurrentUser().$promise.then(function(user) {
      $scope.currentUser = user;

      //init xpush
      $rootScope.xpush.on( 'message', function(channel, name, data){
        console.log( channel, name, data );

        // currentChannel
        if( currnetChannel == channel ){
          console.log( data );

          data.MG  = decodeURIComponent( data.MG );

          var side = "left";
          var opposite = "right";
          if( data.UO.U == $scope.currentUser ){
            side = "right";
            opposite = "left";
          }

          var newMessage = {userid: data.UO.U, time:data.TS, message:data.MG, side:side, opposite:opposite};

          $scope.messages.push(newMessage);
          $scope.$broadcast("items_changed")
          $scope.messageText = "";
        } else {
          $scope.newChannelArray.push( { "C" : data.C, "NM" : data.C, "CT" : 0 } );
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
      DT.F = useSnap;      
      if( type !== undefined ){
        DT.T = type;
      }

      $rootScope.xpush.send($scope.currentChannel, 'message', DT );
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
