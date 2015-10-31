'use strict';

angular.module('stalkApp')
  .controller('SignupCtrl', function ($rootScope, $stateParams, $scope, Auth, $location, $window) {

    $scope.user = {};
    $scope.errors = {};
    $rootScope.isLogin = true;

    var uid = $stateParams.uid;
    var email = $stateParams.email;
    var name = $stateParams.name;

    $scope.user.email = email;
    $scope.user.uid = uid;
    $scope.user.name = name;

    $scope.register = function (form) {
      $scope.submitted = true;

      if (form.$valid) {

        Auth.activate({
          uid: $scope.user.uid,
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
