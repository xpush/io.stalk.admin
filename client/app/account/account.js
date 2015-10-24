'use strict';

angular.module('withtalkApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signupmail', {
        url: '/signupmail',
        templateUrl: 'app/account/signupmail/signupmail.html',
        controller: 'SignupMailCtrl'
      })
      .state('sendmail', {
        url: '/sendmail/:name/:email',
        templateUrl: 'app/account/sendmail/sendmail.html',
        controller: 'SendMailCtrl'
      })
      .state('signup', { // TODO 이미 active 되었다면, 404 로 response 해야 함. !!
        url: '/signup/:name/:email/:uid',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });