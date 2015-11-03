'use strict';

angular.module('stalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $interval, Chat) {

    $rootScope.isLogin = false;
    $scope.message = 'Hello';

    $scope.current_visitor = 0;
    $scope.current_operators = 0;
    $scope.current_chatting = 0;
    $scope.current_waiting = 0;

    var dashboard = $interval(function () {
      $scope.current_visitor += 1;
      $scope.current_operators += 1;
      $scope.current_chatting += 2;
      $scope.current_waiting += 3;

      if ($scope.current_visitor == 80) {
        $interval.cancel(dashboard);
      }
    }, 10);


    $scope.sendNotificaton = function () {

      alert(CKEDITOR.instances['editor1'].getData());
    };


  });
