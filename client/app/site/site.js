'use strict';

angular.module('stalkApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('site', {
        url: '/site',
        templateUrl: 'app/site/site.html',
        controller: 'SiteCtrl',
        authenticate: true
      });
  });