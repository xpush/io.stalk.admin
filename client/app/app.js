'use strict';

angular.module('stalkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'toaster',
  'stalk.constants'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    //$urlRouterProvider
    //.otherwise('/signupmail');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

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

  .run(function ($rootScope, $location, $http, Auth, NEED_EMAIL_CONFIRM) {

    $http({
      method: 'GET',
      url: '/api/auths/server',
      headers: {
        'Content-Type': "application/json; charset=utf-8"
      }
    }).then(function (result) {

      $rootScope.GLOBAL_SERVER_URL = result.data.server;
      $rootScope.GLOBAL_APP = result.data.app;

      $rootScope.xpush = new XPush(result.data.server, result.data.app, function (type, data) {
        console.log(type, data);
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
