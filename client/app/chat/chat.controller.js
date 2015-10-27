'use strict';

angular.module('withtalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope) {
    console.log( $rootScope.xpush );
    $rootScope.isLogin=false;
    $scope.messages = [{userid:"eskozz", time:"Feb 29 2:30 PM", message:"hi hello how are you", side:"left", opposite:"right"},
                      {userid:"", time:"Feb 29 2:31 PM", message:"im fine thank you and you?", side:"right", opposite:"left"}];

    $scope.sendMessage = function () {
      console.log( "===== send =====" );
      console.log($scope.messageText);
      var newMessage = {userid:"", time:currentTime(), message:$scope.messageText, side:"right", opposite:"left"};
      var newReturnMessage = {userid:"eskozz", time:currentTime(), message:$scope.messageText+$scope.messageText, side:"left", opposite:"right"};

      $scope.messages.push(newMessage);
      $scope.messages.push(newReturnMessage);
      $scope.$broadcast("items_changed")
      $scope.messageText = "";
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
