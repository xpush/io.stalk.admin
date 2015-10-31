'use strict';

angular.module('stalkApp')
  .controller('SendMailCtrl', function ($rootScope, $scope, $stateParams, Auth, $location, $window) {

    console.log($stateParams.name);
    console.log($stateParams.email);

    $scope.name = $stateParams.name;
    $scope.email = $stateParams.email;


    $rootScope.isLogin = true;


  });
