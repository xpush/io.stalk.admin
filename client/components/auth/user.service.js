'use strict';

angular.module('withtalkApp')
  .factory('User', function ($resource) {
    return $resource('api/auths/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
    });
  });
