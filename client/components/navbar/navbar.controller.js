'use strict';

angular.module('stalkApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth, Chat) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    Auth.getCurrentUser().$promise.then(function (user) {
      var hash = CryptoJS.HmacSHA256(user.uid, "sha256");
      var pw = CryptoJS.enc.Base64.stringify(hash);

      $rootScope.xpush.login(user.uid, pw, 'WEB', function (err, data) {
        console.log('login success : ', data);
        //if( data ) Chat.init();

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
