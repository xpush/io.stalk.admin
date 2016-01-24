'use strict';

angular.module('stalkApp')
  .directive('scrollToTopWhen', function () {
    return {
      template: '',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        scope.$on('items_changed', function () {
          //element.scrollTop(element[0].scrollHeight);
          $("#chatArea").animate({scrollTop: element[0].scrollHeight}, "slow");
          //console.log(element.scrollTop)
        });
      }
    };
  });