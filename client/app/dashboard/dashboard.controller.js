'use strict';

angular.module('withtalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, Auth) {
    $rootScope.isLogin=false;
    $scope.message = 'Hello';

    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.sendNotificaton = function(){
      alert(CKEDITOR.instances['editor1'].getData());
    };


  });
