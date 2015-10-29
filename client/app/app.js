'use strict';

angular.module('withtalkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'toaster'
])
  .run(function($rootScope){
        // xpush 를 생성한다.
    $rootScope.xpush = new XPush('http://54.178.160.166:8000', 'withtalk', function (type, data){

      // LOGOUT event 를 설정한다.
      if(type === 'LOGOUT'){
        if( !$sessionStorage.reloading ){
          $rootScope.logout( function(){
            $state.go( "error" );
          });
        }
      }
    }, false ); 
    //$rootScope.xpush.enableDebug();
  })
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/signupmail');

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
      responseError: function(response) {
        if(response.status === 401) {
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

  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $rootScope.$evalAsync(function() {
            $location.path('/login');
          });
        }
      });
    });
  });
