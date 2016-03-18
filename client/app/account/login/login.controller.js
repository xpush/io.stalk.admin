'use strict';

angular.module('stalkApp')
  .controller('LoginCtrl', function ($rootScope, $translate, $scope, Auth, $location, $window, NotificationManager) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.isLogin = true;

    NotificationManager.start();

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function (data) {
            // Logged in, redirect to home
            if (data.token) {
              $location.path('/dashboard');
            } else {
              $scope.result = data.message;
            }

            //$location.path('/');
          })
          .catch(function (err) {
            console.log(err);
            $scope.errors.other = err.message;
            $scope.result = err.message;
          });
      }
    };
  });
