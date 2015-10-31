'use strict';

angular.module('stalkApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatCtrl',
        authenticate: true
      });
  })
/**
 * @ngdoc directive
 * @name ngEnter
 * @module messengerx.directives
 * @kind directive
 *
 * @description execute function on enter key
 * enter 입력시 ng-enter에 등록된 함수를 실행한다.
 */
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });
