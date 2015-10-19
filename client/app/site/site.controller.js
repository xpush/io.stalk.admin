'use strict';

angular.module('withtalkApp')
  .controller('SiteCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.newSite = {};

    $scope.sites = [{site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.14"},
    {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.15"},
    {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.16"}];

    $scope.addNewSite = function(){


      console.log($scope.newSite.site_name);
      console.log($scope.newSite.site_url);

      //@TODO Save Site and retireve again

      $scope.sites.push({site_name:"Tistory1",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.15"})
    }

  });
