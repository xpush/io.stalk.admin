'use strict';

angular.module('stalkApp')
  .controller('ChatCtrl', function ($rootScope, $scope, Auth, Chat, Util, Channel) {
    $scope.tabs = [];
    $scope.pastChannels = [];

    $scope.currentChannel = {};
    $scope.messageText = "";

    $scope.siteArray = [];
    $scope.siteIds = {};
    $scope.messages = [];
    $scope.mapInit = false;
    $scope.isPast = false;
    $scope.isLoading = false;

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

      fileObj = document.getElementById("file");
      var file = fileObj.files[0];

      // File Type check, image type 이 아닌 경우를 체크
      if( file.type.indexOf( "image" ) < 0 ){
        var alertMessage = {title: 'Upload Failed'};
        alertMessage.subTitle = 'Upload only images';

        //$ionicPopup.alert( alertMessage );
        inputObj.value = ""

        return;
      }

      $rootScope.xpush.uploadFileInBrowser( $scope.currentChannel.C, fileObj, null, function(err, result){
        if( !err ){
          fileObj.value = "";
          $scope.sendMessage( result, 'IM' );
        }
      });
    };

    $scope.viewImage = function($event){

      var obj = $event.target;
      if( obj.src ){

        var zoomImg = document.getElementById( "stalk-zoomed-image" );
        var maxWidth = window.innerWidth - 80;
        var w;
        var h;
        var ratio = ( obj.naturalWidth / obj.naturalHeight) ;

        var isMaxWidth = false;
        if( maxWidth > obj.naturalWidth ) {
          w =  obj.naturalWidth;
        } else {
          isMaxWidth = true;
          w = maxWidth;
        }

        var isMaxHeight = false;
        var maxHeight = window.innerHeight - 80;
        if( maxHeight  > obj.naturalHeight ){
          h = obj.naturalHeight;
        } else {
          isMaxHeight = true;
          h = maxHeight;
        }

        if( isMaxWidth && isMaxHeight ){
          if( obj.naturalWidth > obj.naturalHeight ){
            h = w / ratio;
          } else {
            w = h * ratio;
          }
        } else if( isMaxWidth ){
          h = w / ratio;
        } else if ( isMaxHeight ){
          w = h * ratio;
        }
        
        zoomImg.style.width = w+"px";
        zoomImg.style.height = h+"px";
        zoomImg.style.left = ( window.innerWidth - w ) / 2+"px";
        zoomImg.style.top = ( window.innerHeight - h ) / 2+"px";
        zoomImg.src = obj.src;
        zoomImg.onload = function(){
          if( document.getElementById( "stalk-image-viewer" ) ){
            document.getElementById( "stalk-image-viewer" ).style.display = "block";
          }
        };
      }
    };

    $scope.closeImage = function($event){
      var obj = document.getElementById( "stalk-image-viewer" );
      if( obj.style.display != "none" ){
        obj.style.display = 'none';
      }
    };

    $scope.setSites = function (data) {

      var selectedChannel;
      var changed = false;
      if (!data) {

        var sites = Chat.getAllSites();

        for (var siteId in sites) {
          var channels = sites[siteId];
          var siteInfo = Chat.getSiteInfo(siteId);

          $scope.siteIds[siteId] = $scope.siteArray.length;
          $scope.siteArray.push({'siteId': siteId, 'channels': channels, 'origin':siteInfo});

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

        var siteId = data.siteId;
        if ($scope.siteIds[siteId] == undefined) {
          var channels = Chat.getChannels(siteId);
          var siteInfo = Chat.getSiteInfo(siteId);

          $scope.siteIds[siteId] = $scope.siteArray.length;
          $scope.siteArray.push({'siteId': siteId, 'channels': channels, 'origin':siteInfo});
          changed = true;
        }
      }
      if (changed) {
        $scope.$apply();
        changed = false;
      }

      if( selectedChannel ){
        $scope.gotoChat( selectedChannel );  
      }

      // console.log( $scope.siteArray );
    };

    $rootScope.$on("$onInfo", function (event, data) {
      $scope.setSites(data);
    });

    $scope.gotoBroadcast = function( site ){ 
      var ch = {};
      ch.title = site.origin;
      ch.name = site.origin;
      ch.C = site.siteId;
      ch.isBroadcast = true;
      ch.channel = site.siteId;
      $scope.gotoChat( ch );
      $scope.getUsers( ch.C );
    };

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

    $scope.searchMessage = function (){
      var inputMsg = document.getElementById("inputMessage").value.toString().trim();
      if( inputMsg && inputMsg.length > 0 ){
        for( var inx = $scope.messages.length-1 ; inx >= 0 ; inx-- ){
          var msgObj = $scope.messages[inx];

          if( inx < $scope.searchInx && msgObj.type == 'MG' && msgObj.message.indexOf( inputMsg ) > -1 ){

            var orgMsg = msgObj.message;
            if( !$scope.messages[inx].matched ){
              $scope.messages[inx].searchedMessage = orgMsg.replace( inputMsg, "<span class='match' id='match'>"+inputMsg+"</span>" );
            }

            $scope.messages[inx].matched = true;
            $scope.searchInx = inx;

            var offsetTop = $( "#m"+inx ).offset().top;
      
            // TODO : Impl animate
            //$("#chatArea").animate({scrollTop: offsetTop}, "slow");

            break;
          } else {
            var orgMsg = msgObj.message;
            $scope.messages[inx].matched = false;
          }
        }
        //console.log( $scope.messages );
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
      $scope.currentChannel.isPast = false;
      $scope.tabs.length = 0;
      $scope.tabs = [];
      $scope.tabs.push(ch);

      Chat.setActiveChannel(ch.C);
      Chat.initChannel(ch.C, function(){
        $scope.messages = Chat.getMessages(ch.C);
      });

      var tab = document.getElementById("tab_" + ch.C);
      angular.element(tab).parent().addClass("active");

      $scope.getLocationInfo( ch );
      $scope.messages = Chat.getMessages(ch.C);
    };

    $scope.gotoPastChat = function (ch) {
      $scope.isLoading = true;

      ch.C = ch.channel;

      $scope.currentChannel = ch;
      $scope.currentChannel.isLoading = true;
      $scope.currentChannel.isPast = true;

      if( $scope.currentChannel.endTimestamp ){
        var timeArr = $scope.timeToString($scope.currentChannel.endTimestamp);
        var time = timeArr[1] +" "+ timeArr[2];
        $scope.currentChannel.endTime = time;
      }


      $scope.tabs.length = 0;
      $scope.tabs = [];
      $scope.tabs.push(ch);

      var tab = document.getElementById("tab_" + ch.C);
      angular.element(tab).parent().addClass("active");

      $scope.getLocationInfo( ch );
      Chat.getOldMessages( ch.C, function( oldMessages ){
        $scope.messages = oldMessages;
        $scope.searchInx = $scope.messages.length;
        $scope.currentChannel.isLoading = false;

        var stmp = $scope.messages.length * 10;
      });
    };

    $scope.timeToString = function (timestamp) {

      return Util.timeToString(timestamp);
    };

    $scope.getUsers = function(channel){
      //TODO impl this
      $scope.users = [];
    };

    $scope.getLocationInfo = function(ch){
      if( !ch.data ){
        return;
      }

      var ip = ch.data.ip;

      if( ch.data && ch.data.lat && ch.data.lon && ch.data.country ){
        if( !$scope.mapInit ){
          setWorldMap(ch.data.lat, ch.data.lng, ch.data.country);
          $scope.mapInit = true;
        }
      } else {
        Chat.getGeoLocation(ip).then(function (geo) {

          var lng = geo.lon;
          var lat = geo.lat;
          var country = geo.country;

          if( !$scope.mapInit ){
            setWorldMap(lat, lng, country);
            $scope.mapInit = true;
          }
        });
      }  
    };

    // Init Site List
    Channel.search({}).then( function(channels) {

      for( var inx = 0 ; inx < channels.length ; inx++ ){
        if( !channels[inx].active ){
          $scope.pastChannels.push( channels[inx] );
        } else {
          Chat.addChannel(channels[inx]);
        }
      }

      $scope.setSites();
    });

    $rootScope.$on('channel_changed', function(){
      $scope.siteArray = [];
      $scope.pastChannels = [];

      // Init Site List
      Channel.search({}).then( function(channels) {

        for( var inx = 0 ; inx < channels.length ; inx++ ){
          if( !channels[inx].active ){
            $scope.pastChannels.push( channels[inx] );
          } else {
            Chat.addChannel(channels[inx]);
          }
        }

        $scope.setSites();
      });
    });
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
