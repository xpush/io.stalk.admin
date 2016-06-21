'use strict';

angular.module('stalkApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth, Chat, toaster, $translate) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.login = function(){

      Auth.getCurrentUser().$promise.then(function (user) {

        var hash = CryptoJS.HmacSHA256(user.uid, "sha256");
        var pw = CryptoJS.enc.Base64.stringify(hash);

        $rootScope.currentUser = user;

        $rootScope.profileInfo.name = user.name;
        $rootScope.profileInfo.image = user.image;

        $rootScope.xpush.login(user.uid, pw, 'WEB', function (err, data) {

          if (err) {
            if (err == 'ERR-SRV_NOT_EXISTED') {
              $rootScope.errorMessage = '<h3>Connection to server failed ! </h3><br><b>Channel server is not existed.</b>';
            } else if (err == 'ERR-SRV_CONNECT_FAILED') {
              $rootScope.errorMessage = '<h3>Connection to server failed ! </h3><br>Check XPUSH session server ( <b>' + $rootScope.xpush.getServerAddress() + '</b> )';
            } else if (err == 'ERR-NOTEXIST') {
              $rootScope.errorMessage = '<h3>User is not existed ! </h3><br>Check XPUSH session server ( <b>' + $rootScope.xpush.getServerAddress() + '</b> )';
            } else {
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

            $rootScope.$on("$onMessage", function (event, channel, data) {
              $scope.unreadMessage = Chat.getAllUnreadMssages();
              $scope.unreadCount = $scope.unreadMessage.length;
              $scope.$apply();
            });
          }

        });
      }).catch(function () {
        console.log('==== err =====');
      });
    }

    $scope.logout = function () {
      $rootScope.xpush.logout();
      Auth.logout();
      $location.path('/login');
    };

    $scope.unreadCount = 0;
    $scope.unreadMessage = [];
    $rootScope.currentUser;

    $rootScope.profileInfo = {};

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.stat = "online";

    $scope.login();

    if( $rootScope.language ){
      $scope.currentLanguage = $rootScope.language;
    } else {
      $scope.currentLanguage = $translate.proposedLanguage();
    }

    $scope.isActive = function (stat) {
      return $scope.stat === stat;
    };

    $scope.setStatus = function (stat) {
      if( stat == 'online' ){
        $scope.stat = stat;
        $scope.login();
      } else {
        jQuery('#main-header').css({"z-index":1060} );
        $('#confirmModal').modal('show');
      }
    };

    $scope.cancelBusy = function(){
      jQuery('#main-header').css({"z-index":1030} );
      $('#confirmModal').modal('hide');
    }

    $scope.confirmBusy = function(){
      jQuery('#main-header').css({"z-index":1030} );
      $('#confirmModal').modal('hide');
      $rootScope.xpush.logout();
      $scope.stat = 'busy';
    }

    $scope.profile = function () {
      $('#profileModal').modal('show');
    };

    $scope.changeLanguage = function (langKey) {
      $scope.currentLanguage = langKey;
      $rootScope.language = langKey;
      $translate.use(langKey);

      Auth.updateUser({
        uid: $rootScope.currentUser.uid,
        language: langKey
      })
        .then(function (data) {

        })
        .catch(function (err) {
          err = err.data;
        });
    };

    $scope.toogleLangButton = function( langKey ){
      if ( $scope.currentLanguage == langKey ){
        return false;
      } else {
        return true;
      }
    }

    $rootScope.updateProfile = function (form) {
      //@TODO Save Site and retireve again
      $scope.submitted = true;
      if (form.$valid) {
        Auth.updateUser({
          uid: $rootScope.currentUser.uid,
          name: $rootScope.profileInfo.name,
          image: $rootScope.profileInfo.image
        })
          .then(function (data) {
            // Account created, redirect to home
            toaster.pop('success', "Info", "Saved Successfully");
            $('#profileModal').modal('hide');
          })
          .catch(function (err) {
            err = err.data;
            // Update validity of form fields that match the mongoose errors
          });
      }

    };

    $scope.gotoChat = function( message ){
      if( message ){
        $rootScope.selectedChannelId = message.channel;
      }
      $location.path('/chat');  
    };
  });
