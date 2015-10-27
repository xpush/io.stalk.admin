'use strict';

angular.module('withtalkApp')
  .controller('SiteCtrl', function ($scope, $stateParams, Site, $modal) {
    $scope.message = 'Hello';
    $scope.newSite = {};

    $scope.sites = [];

    $scope.addNewSite = function(){
      //@TODO Save Site and retireve again
      Site.create({
        name: $scope.newSite.site_name,
        url: $scope.newSite.site_url
      })
      .then( function(data) {
        // Account created, redirect to home
        $('#myModal').modal('hide') 

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

    $scope._site={};
    $scope.getCode = function(site){
      angular.copy(site, $scope._site);

      $scope.script='<script src="http://stalk.io/stalk.js"></script>\n<script>STALK.init({app:'+site.name+',url:'+site.url+',id:'+site.key+'});</script>;';
    };

    $scope.updateSite = function(){
      Site.update($scope._site)
      .then( function(data) {
        // Account created, redirect to home
        $scope._site={};

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

    }


    $scope.getSites();





  });
