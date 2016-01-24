'use strict';

angular.module('stalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth, Chat) {
    $scope.tabs = [];
    $scope.sites = [];

    $scope.currentChannel = {};
    $scope.messageText = "";

    $scope.siteArray = [];
    $scope.siteIds = {};
    $scope.messages = [];
    $rootScope.isLogin = false;

    var fileObj;

    $scope.openFile = function(){
      fileObj = document.getElementById("file");
      angular.element( fileObj ).click();

      if( !fileObj.onchange ){
        fileObj.onchange = function(e) {
          $scope.uploadFile();
        };
      }
    };

    $scope.uploadFile = function(){
      var file = fileObj.files[0];

      // File Type check, image type 이 아닌 경우를 체크
      if( file.type.indexOf( "image" ) < 0 ){
        var alertMessage = {title: 'Upload Failed'};
        alertMessage.subTitle = 'Upload only images';

        //$ionicPopup.alert( alertMessage );
        inputObj.value = ""

        return;
      }

      $rootScope.xpush.uploadFile( $scope.currentChannel.C, fileObj.value, fileObj, null, function(err, result){
        console.log( result );
        if( !err ){
          $scope.sendMessage( result.url, 'IM' );
        }
      });
    };

    $scope.setSites = function (data) {

      var selectedChannel;
      var changed = false;
      if (!data) {

        var sites = Chat.getAllSites();

        for (var origin in sites) {
          var channels = sites[origin];
          $scope.siteIds[origin] = $scope.siteArray.length;
          $scope.siteArray.push({'origin': origin, 'channels': channels});

          if( !selectedChannel && $rootScope.selectedChannelId ){
            for( var inx = 0; inx < channels.length ; inx++ ){
              if ( $rootScope.selectedChannelId == channels[inx].C ){
                selectedChannel = channels[inx];
                $rootScope.selectedChannelId = undefined;
              }
            }
          }
        }

      } else {

        var origin = data.origin;
        if ($scope.siteIds[origin] == undefined) {
          var channels = Chat.getChannels(origin);
          $scope.siteIds[origin] = $scope.siteArray.length;
          $scope.siteArray.push({'origin': origin, 'channels': channels})
        } else {
          //var inx = $scope.siteIds[origin];          
          //$scope.siteArray[inx].channels.push( data );
        }
        changed = true;
      }
      if (changed) {
        $scope.$apply();
        changed = false;
      }

      if( selectedChannel ){
        $scope.gotoChat( selectedChannel );  
      }
    };

    $rootScope.$on("$onInfo", function (event, data) {
      $scope.setSites(data);
    });

    $scope.sendMessage = function (message, type) {
      var msg;
      if( message ){
        msg = message;
      } else {
        msg = document.getElementById("inputMessage").value.toString().trim();
      }
      msg = encodeURIComponent(msg);

      if (msg !== "") {
        var DT = {
          UO: {U: $rootScope.currentUser.uid, NM: $rootScope.currentUser.name, I: $rootScope.currentUser.image},
          MG: msg
        };

        if( type ){
          DT.TP = type;
        }

        $rootScope.xpush.send($scope.currentChannel.C, 'message', DT);
        document.getElementById("inputMessage").value = "";

      }
    };

    $scope.getUnreadCnt = function (channel) {
      return Chat.getUnreadMessages(channel).length;
    };

    $rootScope.$on("$onMessage", function (event, channel, data) {

      if (channel == $scope.currentChannel.C) {
        $scope.$apply();
        $scope.$broadcast('items_changed');
      } else {
      }
    });

    $scope.gotoChat = function (ch) {

      $scope.currentChannel = ch;
      $scope.tabs.length = 0;
      $scope.tabs = [];
      $scope.tabs.push(ch);

      Chat.setActiveChannel(ch.C);
      $scope.messages = Chat.getMessages(ch.C);

      var tab = document.getElementById("tab_" + ch.C);
      angular.element(tab).parent().addClass("active");

      var ip = ch.ip;
      Chat.getGeoLocation(ip).then(function (geo) {
        var lng = geo.longitude;
        var lat = geo.latitude;
        var name = geo.country;

        setWorldMap(lat, lng, name);
      });

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


    // Init Site List
    $scope.setSites();    
  });

function setWorldMap(lat, lng, name) {
  $('#world-map').vectorMap({
    map: 'world_mill_en',
    scaleColors: ['#C8EEFF', '#0071A4'],
    normalizeFunction: 'polynomial',
    hoverOpacity: 0.7,
    hoverColor: false,
    markerStyle: {
      initial: {
        fill: '#F8E23B',
        stroke: '#383f47'
      }
    },
    backgroundColor: 'transparent',
    markers: [
      {latLng: [lat, lng], name: name},

    ]
  });
}

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
