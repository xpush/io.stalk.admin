'use strict';

angular.module('stalkApp')
  .factory('Chat', function Chat($rootScope, Auth) {
    var currentUser = {};

    var activeChannel = "";
    var channelMessages = {};
    var channelInfos = {};
    var unreadMessages = [];

    var sites = {};
    var onMessageListener;
    var totalUnreadCount = 0;
    var self;

    return {

      init: function () {
        self = this;
        console.log( "event chat service" );
        Auth.getCurrentUser().$promise.then(function (user) {
          currentUser = user;

          $rootScope.xpush.on('info', function (channel, name, data) {
            console.log( "=== info ===" );
            console.log( data );
            if( !channelInfos[channel] ){
              channelInfos[channel] = data;
            }

            var origin = data.OG;
            if( !sites[origin] ){
              sites[origin] = [];
              sites[origin].push( data );
            }
          });

          //init xpush
          $rootScope.xpush.on('message', function (channel, name, data) {
            console.log( "=== data ===" );
            console.log( data );
            if( !channelMessages[channel] ){
              channelMessages[channel] = [];
            }

            data.MG = decodeURIComponent(data.MG);

            var side = "left";
            var opposite = "right";
            if (data.UO.U == currentUser.uid) {
              side = "right";
              opposite = "left";
            }

            var time = self.timeToString(data.TS)[0];
            var newMessage = {userid: data.UO.NM, time: time, message: data.MG, side: side, opposite: opposite, timestamp:data.TS};

            channelMessages[channel].push( newMessage );

            if( activeChannel == channel ){

            } else {
              totalUnreadCount = totalUnreadCount + 1;
              $rootScope.totalUnreadCount = totalUnreadCount;
              unreadMessages.push( newMessage );
            }

            if( onMessageListener ){
              onMessageListener( newMessage, totalUnreadCount );
            }
          });

        }).catch(function () {
          console.log('==== err =====');
        });
      },      
      setActiveChannel : function(channel){        
        activeChannel = channel;        
      },
      setOnMessageListener : function(cb){
        onMessageListener = cb;
      },
      getMessages : function(channel){
        return channelMessages[channel];
      },
      getSites : function(channel){
        return sites[channel];
      },
      getUnreadMssages : function(channel){
        return unreadMessages[channel];
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


