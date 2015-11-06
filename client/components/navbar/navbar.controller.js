'use strict';

angular.module('stalkApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth, Chat, NotificationManager) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.unreadCount = 0;
    $scope.unreadMessage = [];

    Auth.getCurrentUser().$promise.then(function (user) {
      var hash = CryptoJS.HmacSHA256(user.uid, "sha256");
      var pw = CryptoJS.enc.Base64.stringify(hash);


      $rootScope.xpush.login(user.uid, pw, 'WEB', function (err, data) {
        console.log( 'login result : ' + err  );

        if(err){
          if(err == 'ERR-SRV_NOT_EXISTED'){
            $rootScope.errorMessage = '<h3>Connection to server failed ! </h3><br><b>Channel server is not existed.</b>';
          }else if(err == 'ERR-SRV_CONNECT_FAILED'){
            $rootScope.errorMessage = '<h3>Connection to server failed ! </h3><br>Check XPUSH session server ( <b>' + $rootScope.xpush.getServerAddress() + '</b> )';
          }else{
            $rootScope.errorMessage = '<h3>Server Error</h3>';
          }
          $('#dashboardPage').hide();
          $('#navAside').hide();
          $('#navHeader').hide();
          $('#errorModal').modal('show');

        } else {
          if (data) {
            Chat.init();
          }
          $scope.unreadMessage = Chat.getAllUnreadMssages();

          $rootScope.$on( "$onMessage",function(event, channel, data ){
            $scope.unreadMessage = Chat.getAllUnreadMssages();  
            $scope.unreadCount = $scope.unreadMessage.length;
            $scope.$apply();
            var noti = data;
            noti.channel = channel;
            NotificationManager.notify( data );           
          });
        }

      });
    }).catch(function () {
      console.log('==== err =====');
    });

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.stat = "online";


    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function (stat) {
      return $scope.stat === stat;
    };

    $scope.setStatus = function (stat) {
      $scope.stat = stat;
    };
    $scope.profile = function () {
      $('#profileModal').modal('show');
    }
  });
