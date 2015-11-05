'use strict';

angular.module('stalkApp')
  .controller('SignupDirectCtrl', function ($rootScope, $stateParams, $scope, Auth, $location, $window) {

    $scope.user = {};
    $scope.errors = {};
    $rootScope.isLogin = true;


    $scope.user.email = "";
    $scope.user.uid = "";
    $scope.user.name = "";

    $scope.register = function (form) {
      $scope.submitted = true;

      if (form.$valid) {

        Auth.signUpDirect({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function (data) {

            var status = data.status;

            if (status == 'ERR-ACTIVE') {
              $scope.result = data.message;
            } else {
              $location.path('/login');
            }


          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }

    };

    $scope.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
