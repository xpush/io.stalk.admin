'use strict';

angular.module('withtalkApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    Auth.getCurrentUser().$promise.then(function(user) {
      //$rootScope.xpush.enableDebug();
      $rootScope.xpush.login( user.uid, user.uid, 'web', function(err,data){
        console.log('login success : ', data);
      });
    }).catch(function() {
      console.log( '==== err =====' );
    });    

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.stat = "online";


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(stat) {
      console.log(stat);
      return $scope.stat === stat;
    };

    $scope.setStatus = function(stat){
      $scope.stat = stat;
    }
  });
