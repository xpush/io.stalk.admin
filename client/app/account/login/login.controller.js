'use strict';

angular.module('withtalkApp')
  .controller('LoginCtrl', function ($rootScope, $scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.isLogin = true;

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(data) {
          // Logged in, redirect to home
          console.log(data);
          if(data.token){
            $location.path('/');
          }else{
            $scope.result = data.message;
          }

          //$location.path('/');
        })
        .catch( function(err) {
          console.log(err);
          $scope.errors.other = err.message;
          $scope.result = err.message;
        });
      }
    };
  });
