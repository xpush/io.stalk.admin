'use strict';

angular.module('stalkApp')
  .controller('OfflineCtrl', function ($rootScope, $scope, Auth, Chat) {
    $scope.messages = [];

    $scope.setSites = function (data) {


    };

    // Init Site List
    $scope.setSites();    
  });