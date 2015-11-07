'use strict';

angular.module('stalkApp')
  .factory('Chat', function Chat($rootScope, Auth, NotificationManager) {
    var currentUser = {};

    var activeChannel = "";
    var channelMessages = {};
    var channelInfos = {};
    var unreadMessages = {};

    var sites = {};
    var self;

    return {

      init: function () {
        self = this;
        console.log( "event chat service" );
        Auth.getCurrentUser().$promise.then(function (user) {
          currentUser = user;

          $rootScope.xpush.on('info', function (channel, name, data) {
            var newChannelFlag = false;
            if( !channelInfos[channel] ){
              channelInfos[channel] = data;
              newChannelFlag = true;
            }

            var origin = data.origin;
            if( !sites[origin] ){
              sites[origin] = [];
            }

            if( newChannelFlag ){
              if( !data.name ){
                data.name = data.title;
              }
              data.startTime = new Date( data.TS ).toLocaleTimeString();
              sites[origin].push( data );

              $rootScope.$emit( "$onInfo", data );              
            }
          });

          //init xpush
          $rootScope.xpush.on('message', function (channel, name, data) {
            if( !channelMessages[channel] ){
              channelMessages[channel] = [];
              unreadMessages[channel] = [];
            }
            data.MG = decodeURIComponent(data.MG);

            var side = "left";
            var opposite = "right";
            if (data.UO.U == currentUser.uid) {
              side = "right";
              opposite = "left";
            }

            var time = self.timeToString(data.TS)[0];
            var newMessage = {name: data.UO.NM, time: time, message: data.MG, side: side, opposite: opposite, timestamp:data.TS};

            if( data.I ){
              newMessage.image = data.I;
            } else {
              newMessage.image = 'https://raw.githubusercontent.com/xpush/io.stalk.admin/master/client/assets/images/face.png';
            }
            channelMessages[channel].push( newMessage );

            if( activeChannel == channel ){

            } else {
              newMessage.timeBefore = "1 min";
            
              unreadMessages[channel].push( newMessage );

              newMessage.channel = channel;
              NotificationManager.notify( newMessage );
            }

            $rootScope.$emit( "$onMessage", channel, newMessage );
          });

        }).catch(function () {
          console.log('==== err =====');
        });
      },      
      setActiveChannel : function(channel){        
        activeChannel = channel;
        self.clearUnreadMessages(channel);
      },
      getMessages : function(channel){
        if( !channelMessages[channel] ){
          channelMessages[channel] = [];
        }
        return channelMessages[channel];
      },
      getChannels : function(origin){
        return sites[origin];
      },
      getAllSites : function(){
        return sites;
      },
      clearUnreadMessages : function(channel){
        unreadMessages[channel].length = 0;
      },
      getUnreadMessages : function(channel){
        if( !unreadMessages[channel] ){
          unreadMessages[channel] = [];
        }
        return unreadMessages[channel];
      },
      getAllUnreadMssages : function(){
        var allUnreadMessages = [];
        for( var key in unreadMessages ){
          allUnreadMessages = allUnreadMessages.concat( unreadMessages[key] );

        }
        return allUnreadMessages;
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
  })
.factory('NotificationManager', function($window){
  var notificationsSupport = ('Notification' in window) || ('mozNotification' in navigator);
  var notificationsCnt = 0;
  var notificationsInx = 0;
  var win = angular.element($window);
  var notificationsShown = {};

  return {
    start: start,
    notify: notify,
    clear:clearNotification
  };

  function start () {
    if (!notificationsSupport) {
      return false;
    }

    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      win.on('click', requestPermission );
    }

    try {
      win.on('beforeunload', clearNotification);
    } catch (e) {}
  }

  function requestPermission() {
    Notification.requestPermission(function (permission) {
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
    win.off('click', requestPermission );
  }

  function notify (data) {
    notificationsCnt++;

    if (!notificationsSupport ||
        'Notification' in window && Notification.permission !== 'granted') {
      return false;
    }

    var idx = ++notificationsInx,
        channel = data.channel,
        notification;

    if ('Notification' in window) {
      notification = new Notification(data.name, {
        icon: data.image, body: data.message
      });
    } else if ('mozNotification' in navigator) {
      notification = navigator.mozNotification.createNotification(data.name, data.message, data.image);
    } else {
      return;
    }

    notification.onclick = function () {
      notification.close();

      var $stateParams = {};
      var channelId = data.channel;

      closeChannelNotification( channelId );
    };

    if (notification.show) {
      notification.show();
    }

    if( !notificationsShown[channel] ){
      notificationsShown[channel] = [];
    }

    notificationsShown[channel].push( notification );
  };

  function closeChannelNotification( channel ) {
    angular.forEach(notificationsShown[channel], function (notification) {
      try {
        if (notification.close) {
          notification.close();
        }

        if( notificationsCnt > 0 ){
          notificationsCnt--;
        }
      } catch (e) {}
    });

    notificationsShown[channel] = [];
  }

  function clearNotification() {
    for( var channel in notificationsShown ){
      angular.forEach(notificationsShown[channel], function (notification) {
        try {
          if (notification.close) {
            notification.close();
          }
        } catch (e) {}
      });
    }

    notificationsShown = {};
    notificationsCnt = 0;
  }
});


