'use strict';

angular.module('stalkApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('offline', {
        url: '/offline',
        templateUrl: 'app/offline/offline.html',
        controller: 'OfflineCtrl',
        authenticate: true
      });
  });