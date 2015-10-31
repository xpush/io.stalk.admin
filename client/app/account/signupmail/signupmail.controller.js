'use strict';

angular.module('stalkApp')
  .controller('SignupMailCtrl', function ($rootScope, $scope, $state, Auth, $location, $window) {


    $scope.user = {};
    $scope.errors = {};
    $rootScope.isLogin = true;


    $scope.register = function (form) {
      $scope.submitted = true;


      if (form.$valid) {
        console.log($scope.user);

        Auth.signUp({
          name: $scope.user.name,
          email: $scope.user.email
        })
          .then(function (data) {
            // Account created, redirect to home
            console.log(data);

            var status = data.status;

            if (status == 'AUTH-DEACTIVE') {
              $scope.result = data.message;
            } else if (status == 'USER-EXIST') {
              $scope.result = data.message;
            } else {
              $state.go("sendmail", {'name': $scope.user.name, 'email': $scope.user.email});
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


  });
