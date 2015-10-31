'use strict';

describe('Controller: SiteCtrl', function () {

  // load the controller's module
  beforeEach(module('stalkApp'));

  var SiteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SiteCtrl = $controller('SiteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
