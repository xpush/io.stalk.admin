'use strict';

angular.module('stalkApp')
  .controller('SiteCtrl', function ($rootScope, $scope, $stateParams, Site, toaster, Modal) {

    $rootScope.isLogin = false;
    $scope.newSite = {};
    $scope.isDisable = true;
    $scope.sites = [];

    $('#siteDetail').hide();

    $scope.addNewSite = function (form) {
      //@TODO Save Site and retireve again
      $scope.submitted = true;
      if (form.$valid) {
        Site.create({
          name: $scope.newSite.site_name,
          url: $scope.newSite.site_url
        })
          .then(function (data) {
            // Account created, redirect to home
            toaster.pop('success', "Info", "Saved Successfully");

            $('#myModal').modal('hide');
            $scope.successScript = generateScript(data);
            $('#successModal').modal('show');

            var status = data.status;
            var message = data.message;

            $scope.getSites();
            if (status == 'ERR-ACTIVE') {
              $scope.result = data.message;
            } else {
              //$location.path('/login');
            }


          })
          .catch(function (err) {
            err = err.data;

            // Update validity of form fields that match the mongoose errors

          });
      }

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
    var generateScript = function (site) {
      var script = "<script>\n" + "window.stalkConfig = ";
      var metaObj = {"server": "http://dev.admin.stalk.io:8000", id: site.key};
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
      $scope.script = generateScript(site);

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
          console.log(data);
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
    $scope.removeSite = Modal.confirm.delete(function (site) {
      Site.remove($scope._site)
        .then(function (data) {
          // Account created, redirect to home
          $scope._site = {};
          $scope.script = "";
          $scope.isDisable = true;
          toaster.pop('success', "Info", "Deleted Successfully");
          var status = data.status;
          var message = data.message;


          $scope.getSites();
          if (status == 'ERR-ACTIVE') {
            $scope.result = data.message;
          } else {
            //$location.path('/login');
          }

          $('#siteDetail').hide();

        })
        .catch(function (err) {
          err = err.data;
          console.error(err);
          // Update validity of form fields that match the mongoose errors

        });
    });

    $scope.getSites();

    $scope.pop = function () {
      toaster.pop('success', "title", "text");
      toaster.pop('error', "title", "text");
      toaster.pop('warning', "title", "text");
      toaster.pop('note', "title", "text");
    };

  });
