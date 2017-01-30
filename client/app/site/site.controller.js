'use strict';

angular.module('stalkApp')
  .controller('SiteCtrl', function ($rootScope, $scope, $stateParams, Site, toaster, $uibModal, $document) {

    var $ctrl = this;

    $scope.animationsEnabled = true;

    $rootScope.isLogin = false;
    $scope.newSite = {};
    $scope.isDisable = true;
    $scope.sites = [];

    $scope.successScript = "1234";

    $('#siteDetail').hide();

    var modalInstance;

    $scope.openModal = function () {

      modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'sm',
        scope: $scope,
        resolve: {
        }
      });

      modalInstance.result.then(function (selectedItem) {
      }, function () {
        
      });
    };

    $scope.openSuccessModal = function (successScript) {

      $scope.successScript = successScript;

      modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'successModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'sm',
        scope: $scope,
        resolve: {
        }
      });

    };

    $scope.getSites = function () {
      Site.get({})
        .then(function (data) {
          // Account created, redirect to home
          $scope.sites = data;
          var status = data.status;
          var message = data.message;

          if (status == 'ERR-ACTIVE') {
            $scope.result = data.message;
          } else {
            //$location.path('/login');
          }


        })
        .catch(function (err) {
          err = err.data;

          console.error(err);
          // Update validity of form fields that match the mongoose errors

        });
    };

    $scope.generateScript = function (site) {
      var script = "<script>\n" + "window.stalkConfig = ";
      var metaObj = {
        "server": 'http://' + $rootScope.GLOBAL_SERVER_STALK_URL, // TODO http 프로토콜을 하드코딩 하지 말고 어떻게하면 좋을까?
        id: site.key
      };
      script += JSON.stringify(metaObj, null, 4) + ";\n</script>\n";
      script += '<script src="http://static.stalk.io/widget.js"></script>';
      return script;
    };

    $scope._site = {};

    $scope.getCode = function (site) {
      angular.copy(site, $scope._site);

      if ($scope._site != null) {
        $scope.isDisable = false;
      }
      $scope.script = $scope.generateScript(site);

      $('#siteDetail').show();

    };

    $scope.updateSite = function () {
      Site.update($scope._site)
        .then(function (data) {
          // Account created, redirect to home
          $scope._site = {};
          $scope.script = "";
          $scope.isDisable = true;

          var status = data.status;
          var message = data.message;
          toaster.pop('success', "Info", "Saved Successfully");
          $scope.getSites();
          if (status == 'ERR-ACTIVE') {
            $scope.result = data.message;
          } else {
            //$location.path('/login');
          }

          $('#siteDetail').show();

        })
        .catch(function (err) {
          err = err.data;
          console.log(err);
          // Update validity of form fields that match the mongoose errors

        });

    };

    $scope.getSites();

    $scope.pop = function () {
      toaster.pop('success', "title", "text");
      toaster.pop('error', "title", "text");
      toaster.pop('warning', "title", "text");
      toaster.pop('note', "title", "text");
    };

  });

angular.module('stalkApp')
  .controller('ModalInstanceCtrl', function ($uibModalInstance, Site, toaster, $scope) {
  var $ctrl = this;

  $ctrl.newSite = {};
  $ctrl.successScript= "";

  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.addNewSite = function (form) {
    //@TODO Save Site and retireve again
    $ctrl.submitted = true;
    if (form.$valid) {
      Site.create({
        name: $ctrl.newSite.site_name,
        url: $ctrl.newSite.site_url
      })
        .then(function (data) {

          // Account created, redirect to home
          toaster.pop('success', "Info", "Saved Successfully");

          $uibModalInstance.dismiss('cancel');
          var successScript = $scope.generateScript(data);

          $scope.openSuccessModal(successScript);

          var status = data.status;

          $scope.getSites();
          if (status == 'ERR-ACTIVE') {
            $scope.result = data.message;
          } else {
            //$location.path('/login');
          }
        })
        .catch(function (err) {
          err = err.data;

          console.log(err);

        });
    }

  };
});