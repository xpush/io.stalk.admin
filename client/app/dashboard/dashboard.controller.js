'use strict';

angular.module('stalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $interval, Site, Chat, $http) {
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

    var startDashboard = function (key, value) {
      var dashboard = $interval(function () {
        if ($scope[key] == value || value == 0) {
          $interval.cancel(dashboard);
        } else {
          $scope[key] += 1;
        }
      }, 10);
    };

    var postData = function (url, data, cb) {
      data = data || {};
      var req = {
        method: 'POST',
        url: '/api/analytics/' + url,
        headers: {
          'Content-Type': "application/json; charset=utf-8"
        },
        data: data
      };
      console.log(req.url, data);
      $http(req).then(function (data) {
        if (cb)cb(null, data);
      }, function (err) {

        console.log(err);
        if (cb) cb(err)
      });
    };

    var getCurrentCustomer = function () {
      postData("currentCustomers", {A: $scope.siteId}, function (err, data) {
        var count = data.data.count;
        console.log("===== current Customer ");
        console.log(data.data);
        startDashboard("current_visitor", count);
        startDashboard("current_operators", 1);
      })
    };

    var todayCustomers = function () {
      postData("todayCustomers", {}, function (err, data) {
        $scope.todayVisitors = data.data.count;
        getReferSite();
      })
    };

    var getReferSite = function () {
      postData("getReferSites", {}, function (err, data) {
        console.log("=-===== getReferSite");
        var refers = data.data;
        var totalCnt = 0;

        refers = refers.filter(function (r) {
          if (!r._id || r._id.length < 1) {
            return false;
          } else {
            return true;
          }
        });

        refers.sort(function (a, b) {
          return a.count > b.count;
        });

        refers.forEach(function (r) {
          totalCnt += r.count;
        });

        $scope.referrals = Math.round((totalCnt / $scope.todayVisitors) * 100);
        $scope.organic = 100 - $scope.referrals;

        $scope.referSites = refers;
      })
    };

    var getBrowserInfos = function () {
      postData("getBrowserInfos", {}, function (err, data) {
        var idx = 0;
        var colorOrder = ["red", "green", "yellow", "aqua", "light-blue", "gray"];
        var colors = {
          red: "#f56954",
          green: "#00a65a",
          yellow: "#f39c12",
          aqua: "#00c0ef",
          "light-blue": "#3c8dbc",
          gray: "#d2d6de"
        };
        data.data = data.data.map(function (d) {
          console.log(d._id);
          d.label = d._id == null ? "navigator" : d._id;
          d.value = d.count;
          d.colorName = colorOrder[idx];
          d.color = colors[colorOrder[idx]];
          d.highlight = colors[colorOrder[idx]];
          if (idx < colorOrder.length) idx++;
          return d;
        });

        $scope.browserInfos = data.data;
        createPieChart($scope.browserInfos);
      });
    };

    Site.get({})
      .then(function (data) {

        console.log(data);

        if (data && data.length > 0) {
          $scope.siteId = data[0].key;
        }

        getCurrentCustomer();
        todayCustomers();
        getBrowserInfos();

      })
      .catch(function (err) {

      });


    // getReferSite();

  });

function createPieChart(data) {
  var pieChartCanvas = $("#pieChart").get(0).getContext("2d");

  console.log(data);
  var pieChart = new Chart(pieChartCanvas);
  var PieData = data;
  var pieOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 1,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
    //String - A tooltip template
    tooltipTemplate: "<%=value %> <%=label%> users"
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);
}

