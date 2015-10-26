'use strict';

angular.module('withtalkApp')
  .controller('SiteCtrl', function ($scope, $stateParams, Site, Modal) {
    $scope.message = 'Hello';
    $scope.newSite = {};

    $scope.sites = [];

    $scope.openModal = Modal.show.addSite(function(user) {
      console.log(user);
    });

    $scope.addNewSite = function(){
      //@TODO Save Site and retireve again

      Site.create({
        name: $scope.newSite.site_name,
        url: $scope.newSite.site_url
      })
      .then( function(data) {
        // Account created, redirect to home
        $('#myModal').modal('hide') 
        console.log(data);

        var status = data.status;
        var message = data.message;

        $scope.getSites();
        if(status=='ERR-ACTIVE'){
          $scope.result = data.message;
        }else{
          //$location.path('/login');
        }


      })
      .catch( function(err) {
        err = err.data;

        // Update validity of form fields that match the mongoose errors

      });

      //$scope.sites.push({site_name:"Tistory1",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.15"})
    }

    $scope.getSites = function(){
      Site.get({
      })
      .then( function(data) {
        // Account created, redirect to home
        console.log(data);
        $scope.sites = data;
        var status = data.status;
        var message = data.message;

        if(status=='ERR-ACTIVE'){
          $scope.result = data.message;
        }else{
          //$location.path('/login');
        }


      })
      .catch( function(err) {
        err = err.data;

        // Update validity of form fields that match the mongoose errors

      });
    }

    $scope.getSites();

  });
