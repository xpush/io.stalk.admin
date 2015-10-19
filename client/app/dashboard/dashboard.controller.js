'use strict';

angular.module('withtalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, Auth) {
    $rootScope.isLogin=false;
    console.log("hello");
    $scope.message = 'Hello';

    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log($scope.getCurrentUser().name);
  });
