'use strict';

angular.module('stalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $interval, Chat, $http) {

    $rootScope.isLogin = false;
    $scope.message = 'Hello';

    $scope.current_visitor = 0;
    $scope.current_operators = 0;
    $scope.current_chatting = 0;
    $scope.current_waiting = 0;
    /*
    var dashboard = $interval(function () {
      $scope.current_visitor += 1;
      $scope.current_operators += 1;
      $scope.current_chatting += 2;
      $scope.current_waiting += 3;

      if ($scope.current_visitor == 80) {
        $interval.cancel(dashboard);
      }
    }, 10);
    */
    var startDashboard = function(key, value){
      var dashboard = $interval(function () {
        $scope[key] += 1;
        if ($scope[key] == value) {
          $interval.cancel(dashboard);
        }
      }, 10);
    }


    var getCurrentCustomer = function(){
      var req = {
       method: 'POST',
       url: '/api/analytics/currentCustomers',
       headers: {
         'Content-Type': undefined
       },
       data: { test: 'test' }
      }

      $http(req).then(function(data){
        var count = data.data.count;
        startDashboard("current_visitor", count);     
      }, function(){
        console.log("-====== err");
        console.log(arguments);
      });

    }
    getCurrentCustomer();


    $scope.sendNotificaton = function () {

      alert(CKEDITOR.instances['editor1'].getData());
    };


  });
