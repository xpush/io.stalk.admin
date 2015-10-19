'use strict';

describe('Controller: ChatCtrl', function () {

  // load the controller's module
  beforeEach(module('withtalkApp'));

  var ChatCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChatCtrl = $controller('ChatCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
