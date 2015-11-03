'use strict';

angular.module('stalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth,Chat) {
    $scope.tabs = [];
    $scope.sites = [];

    $scope.currentChannel = "";
    $scope.messageText = "";

    $scope.channelIdArray = {};
    $scope.waitingChannelArray = [];
    $scope.messages = [];
    $scope.currentUser;
    $rootScope.isLogin = false;

    Auth.getCurrentUser().$promise.then(function (user) {
      $scope.currentUser = user;
    });
 
    var sites = Chat.getAllSites();
    console.log( sites );
    for( var key in sites ){
      $scope.waitingChannelArray = sites[key];
    }

    $scope.sendMessage = function () {
      var msg = document.getElementById("inputMessage").value;
      msg = encodeURIComponent(msg);

      var DT = {UO: {U: $scope.currentUser.uid, NM: $scope.currentUser.name}, MG: msg};

      $rootScope.xpush.send($scope.currentChannel, 'message', DT);
      document.getElementById("inputMessage").value = "";
    };

    $scope.gotoChat = function (ch) {
      $scope.currentChannel = ch.C;
      $scope.tabs.length = 0;
      $scope.tabs = [];
      $scope.tabs.push( ch );
  
      Chat.setOnMessageListener(function(channel, data, totalUnreadCount ){

        if( channel == $scope.currentChannel ){
          $scope.messages.push( data );
          $scope.$apply();
        }
      });

      var tab = document.getElementById("tab_" + ch.C);
      angular.element(tab).parent().addClass("active");
    };

    $scope.timeToString = function (timestamp) {

      var cDate = new Date();

      var cYyyymmdd = cDate.getFullYear() + "" + (cDate.getMonth() + 1) + "" + cDate.getDate();
      var date = new Date(timestamp);

      var yyyy = date.getFullYear();
      var mm = date.getMonth() + 1;
      var dd = date.getDate();

      var hour = date.getHours();
      hour = hour >= 10 ? hour : "0" + hour;

      var minute = date.getMinutes();
      minute = minute >= 10 ? "" + minute : "0" + minute;

      var second = date.getSeconds();
      second = second >= 10 ? "" + second : "0" + second;

      var yyyymmdd = yyyy + "" + mm + "" + dd;

      var result = [];
      if (cYyyymmdd != yyyymmdd) {
        result.push(yyyy + "-" + mm + "-" + dd);
      } else {
        result.push(hour + ":" + minute + ":" + second);
      }

      result.push(yyyy + "." + mm + "." + dd);
      result.push(date.toLocaleTimeString());

      return result;
    };
  });


function currentTime() {
  var d = new Date;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var dd = d.getDate();
  var m = monthNames[d.getMonth()];
  var time = d.toLocaleTimeString().replace(/:\d+ /, ' ');


  return dd + " " + m + " " + time;

};
