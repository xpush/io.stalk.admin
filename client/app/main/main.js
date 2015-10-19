'use strict';

angular.module('withtalkApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
      authenticate: true
      });
  });