'use strict';

angular.module('stalkApp')
  .factory('Chat', function Chat($rootScope, Auth) {
    var currentUser = {};
    var channelIdArray = [];
    var waitingChannelArray = [];
    var tabs = [];
    var currentChannel = "";

    return {

      init: function () {
        console.log( "event chat service" );
        Auth.getCurrentUser().$promise.then(function (user) {
          currentUser = user;

          $rootScope.xpush.on('info', function (channel, name, data) {
            var searchInx = -1;
            for (var inx = 0; searchInx < 0 && inx < waitingChannelArray.length; inx++) {
              if (waitingChannelArray[inx].C == channel) {
                searchInx = inx;
              }
            }
            if (searchInx == -1) {
              channelIdArray[channel] = data;
              waitingChannelArray.push(data);
              tabs.push({'C': channel, 'messages': [], 'NM': data.NM});
            }
          });

          //init xpush
          $rootScope.xpush.on('message', function (channel, name, data) {

            // currentChannel
            if (currentChannel == channel) {
              var searchInx = -1;
              for (var inx = 0; searchInx < 0 && inx < waitingChannelArray.length; inx++) {
                if (waitingChannelArray[inx].C == channel) {
                  searchInx = inx;
                }
              }

              data.MG = decodeURIComponent(data.MG);

              var side = "left";
              var opposite = "right";
              if (data.UO.U == currentUser.uid) {
                side = "right";
                opposite = "left";
              }

              var time = this.timeToString(data.TS)[0];
              var newMessage = {userid: data.UO.NM, time: time, message: data.MG, side: side, opposite: opposite};

              if (searchInx > -1) {
                tabs[searchInx].messages.push(newMessage);
                $rootScope.$broadcast("items_changed");
              }
            } else {
              if (!channelIdArray[channel]) {
                //$scope.channelIdArray[channel] = true;
                //$scope.waitingChannelArray.push( {'C': channel } );
                //$scope.$apply();
              }
            }
          });

        }).catch(function () {
          console.log('==== err =====');
        });
      },
      timeToString : function(timestamp){
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
      }
    };
  });

