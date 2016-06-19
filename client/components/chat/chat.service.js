'use strict';

angular.module('stalkApp')
  .factory('Chat', function Chat($rootScope, Auth, Channel, NotificationManager, Util) {
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

        Auth.getCurrentUser().$promise.then(function (user) {
          currentUser = user;

          $rootScope.xpush.on('info', function (channel, name, info) {
            info.data = angular.copy(info);

            var newChannelFlag = false;
            if( !channelInfos[channel] ){
              channelInfos[channel] = info;
              newChannelFlag = true;
            }

            var origin = info.origin;
            if( !sites[origin] ){
              sites[origin] = [];
            }

            if( newChannelFlag ){
              if( !info.name ){
                info.name = info.title;
              }
              info.channel = channel;
              info.startTime = new Date( info.TS ).toLocaleTimeString();
              info.startTimestamp = info.TS;
              sites[origin].push( info );

              info.uid = currentUser.uid;
              info.activeYN = 'Y';
              Channel.save( info ).then( function(result){
                //console.log( result );
              })
              .catch(function(err) {
                console.log( err );
              });

              $rootScope.$emit( "$onInfo", info );           
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

            var time = Util.timeToString(data.TS)[0];
            var newMessage = {name: data.UO.NM, time: time, message: data.MG, side: side, opposite: opposite, timestamp:data.TS};
	          if( data.TP ){
              newMessage.type = data.TP;
            } else {
              newMessage.type = "MG";
            }

            if( data.UO.I ){
              newMessage.image = data.UO.I;
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
      closeChannel: function(channel){
        if( channelInfos[channel] ){
          delete channelInfos[channel];

          var searchFlag = false;
          for( var key in sites ){
            var channels = sites[key];

            for( var inx =0 ; !searchFlag && inx < channels.length ; inx++ ){
              if( channels[inx].channel == channel ){
                channels = channels.splice(inx,1);
                searchFlag = true;
              }
            }

            if( searchFlag ){
              if( sites[key].length == 0 ){
                delete sites[key];
              }
            }
          }
          $rootScope.$broadcast('channel_changed');
        }
      },
      getMessages : function(channel){
        if( !channelMessages[channel] ){
          channelMessages[channel] = [];
        }
        return channelMessages[channel];
      },
      addChannel: function(channelInfo){

        var newChannelFlag = false;
        var channel = channelInfo.channel;
        if( !channelInfos[channel] ){
          channelInfos[channel] = channelInfo;
          newChannelFlag = true;
        }

        if( newChannelFlag ){
          var origin = channelInfo.data.origin;
          if( !sites[origin] ){
            sites[origin] = [];
          }

          channelInfo.C = channelInfo.channel;
        
          sites[origin].push( channelInfo );
        }
      },
      getChannels : function(origin){
        return sites[origin];
      },
      getAllSites : function(){
        return sites;
      },
      getGeoLocation : function(ip){
        return Auth.getGeoLocation(ip);
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
      }
    };
  })
.factory('NotificationManager', function($window, $translate){
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

    var message = data.message;
    if( data.type == "IM" ){
      message = $translate.instant('text.image');
    }

    var idx = ++notificationsInx,
        channel = data.channel,
        notification;

    if ('Notification' in window) {
      notification = new Notification(data.name, {
        icon: data.image, body: message
      });
    } else if ('mozNotification' in navigator) {
      notification = navigator.mozNotification.createNotification(data.name, message, data.image);
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
    var chNotiCnt = notificationsShown[channel].length;
    if( chNotiCnt > 3 ){
      notificationsShown[channel][0].close();
      notificationsCnt = 0;
      notificationsShown[channel] = notificationsShown[channel].slice(1, chNotiCnt );
    }  

    // Auto close after 15s
    setTimeout( function(){
      notification.close();      
    }, 15000 );
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


