'use strict';

angular.module('stalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $interval, Chat, $http) {

    $rootScope.isLogin = false;
    $scope.message = 'Hello';

    $scope.current_visitor = 0;
    $scope.current_operators = 0;
    $scope.current_chatting = 0;
    $scope.current_waiting = 0;
    /*
    var dashboard = $interval(function () {
      $scope.current_visitor += 1;
      $scope.current_operators += 1;
      $scope.current_chatting += 2;
      $scope.current_waiting += 3;

      if ($scope.current_visitor == 80) {
        $interval.cancel(dashboard);
      }
    }, 10);
    */
    var startDashboard = function(key, value){
      var dashboard = $interval(function () {
        $scope[key] += 1;
        if ($scope[key] == value) {
          $interval.cancel(dashboard);
        }
      }, 10);
    }

    var postData = function(url, data, cb){
      data  = data || {};
      var req = {
       method: 'POST',
       url: '/api/analytics/'+url,
       headers: {
         'Content-Type': undefined
       },
       data: data
      }

      $http(req).then(function(data){
        if(cb)cb(null,data);
      }, function(err){
        if(cb) cb(err)
      });
    }

    var getCurrentCustomer = function(){
      postData("currentCustomers", {}, function(err, data){
        var count = data.data.count;
        startDashboard("current_visitor", count);     
        startDashboard("current_operators", 1);             
      })
    }

    var todayCustomers = function(){
      postData("todayCustomers", {}, function(err, data){
        $scope.todayVisitors = data.data.count;
        getReferSite();
      })
    }
    var getReferSite = function(){
      postData("getReferSite", {}, function(err, data){
        console.log("=-===== getReferSite");
        var refers = data.data;
        var totalCnt = 0;

        refers = refers.filter(function(r){
          if(!r._id || r._id.length < 1){
            return false;
          }else{
            return true;
          }
        });

        refers.sort(function(a, b){
          return a.count > b.count;
        })

        refers.forEach(function(r){
          totalCnt += r.count;
        })

        $scope.referrals = Math.round((totalCnt / $scope.todayVisitors) * 100);
        $scope.organic =  100 - $scope.referrals;

        $scope.referSites = refers;
      })
    }



    getCurrentCustomer();
    todayCustomers();
    // getReferSite();

  });
