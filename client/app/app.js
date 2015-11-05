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

  .run(function ($rootScope, $location, Auth, XPUSH_SESSION,NEED_EMAIL_CONFIRM) {

    // xpush 를 생성한다.
    $rootScope.xpush = new XPush(XPUSH_SESSION, 'STALK', function (type, data) {
    }, false);

    // for debugging
    $rootScope.xpush.enableDebug(true);

    $rootScope.totalUnreadCount = 0;

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
