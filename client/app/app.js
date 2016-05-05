'use strict';

angular.module('stalkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'toaster',
  'stalk.constants',
  'pascalprecht.translate'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider) {
    //$urlRouterProvider
    //.otherwise('/signupmail');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    $translateProvider

    .useStaticFilesLoader({
      prefix: 'app/translations/',
      suffix: '.json'
    })
    .preferredLanguage('en')
    .fallbackLanguage('en');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $http, Auth, NEED_EMAIL_CONFIRM, Channel) {

    $http({
      method: 'GET',
      url: '/api/auths/server',
      headers: {
        'Content-Type': "application/json; charset=utf-8"
      }
    }).then(function (result) {

      $rootScope.GLOBAL_SERVER_XPUSH_URL = result.data.server.xpush;
      $rootScope.GLOBAL_SERVER_STALK_URL = result.data.server.stalk;
      $rootScope.GLOBAL_APP = result.data.app;

      $rootScope.xpush = new XPush($rootScope.GLOBAL_SERVER_XPUSH_URL, $rootScope.GLOBAL_APP, function (type, data) {
        if( type === 'GLOBAL' && data.event === 'DISCONNECT' ){
          if( data.DT && data.DT.USC == 0 ){
            var info = { 'channel':data.C, 'endTimestamp':data.TS }
            Channel.close( info ).then( function(result){

            })
          }
        }
      }, false);
    }, function (err) {
      console.log(err);
    });


    // for debugging
    //$rootScope.xpush.enableDebug(true);

    $rootScope.needEmailConfirm = NEED_EMAIL_CONFIRM;

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {

      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $rootScope.$evalAsync(function () {
            $location.path('/login');
          });
        }
      });
    });
  });
