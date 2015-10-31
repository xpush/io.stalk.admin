'use strict';

describe('Directive: pwCheck', function () {

  // load the directive's module
  beforeEach(module('stalkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pw-check></pw-check>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the pwCheck directive');
  }));
});