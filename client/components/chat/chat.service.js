'use strict';

angular.module('stalkApp')
  .factory('Chat', function Chat($rootScope, Auth) {
    var currentUser = {};

    var activeChannel = "";
    var channelMessages = {};
    var channelInfos = {};
    var unreadMessages = {};

    var sites = {};
    var onMessageListener;
    var onInfoChangeListener;
    var totalUnreadCount = 0;
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
  
              if( onInfoChangeListener ){
                onInfoChangeListener(data);
              }
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
              newMessage.image = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p160x160/10409695_904936939541182_6229440240546485630_n.jpg?oh=8936673cf42c58178f6910099b779b84&oe=56C4D0A6&__gda__=1455343643_3164d276c8a49ad4b9edeb010d6d58a2';
            }
            channelMessages[channel].push( newMessage );

            if( activeChannel == channel ){

            } else {
              totalUnreadCount = totalUnreadCount + 1;
              $rootScope.totalUnreadCount = totalUnreadCount;
              newMessage.timeBefore = "1 min";
            
              unreadMessages[channel].push( newMessage );
            }

            $rootScope.$broadcast( "$onMessage", channel, newMessage, totalUnreadCount );
          });

        }).catch(function () {
          console.log('==== err =====');
        });
      },      
      setActiveChannel : function(channel){        
        activeChannel = channel;        
      },
      setOnInfoChangeListener : function(cb){
        onInfoChangeListener = cb;
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
  });


