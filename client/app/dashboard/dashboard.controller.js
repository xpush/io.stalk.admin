'use strict';

angular.module('stalkApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $interval, Site, Chat, $http) {
    $rootScope.isLogin = false;
    $scope.message = 'Hello';

    $scope.current_visitor = 0;
    $scope.current_operators = 0;
    $scope.current_chatting = 0;
    $scope.current_waiting = 0;

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
      $http(req).then(function (data) {
        if (cb)cb(null, data);
      }, function (err) {
        console.error(err);
        if (cb) cb(err)
      });
    };

    var getCurrentCustomer = function () {
      postData("currentCustomers", {A: $scope.siteId}, function (err, data) {
        var count = data.data.count;
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

    var weeklyCustomers = function(){
      postData("weeklyCustomers", {}, function (err, data) {
        var results = data.data;
        //$scope.todayVisitors = data.data.count;
        //getReferSite();

        var labels = [];
        var datas = [];

        for ( var key in results ){
          labels.push( results[key].date );
          datas.push( results[key].count );
        }

        createAreaChart(labels, datas);
      })
    };

    var getReferSite = function () {
      postData("getReferSites", {}, function (err, data) {
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
          return a.count < b.count;
        });

        refers.forEach(function (r) {
          totalCnt += r.count;
        });

        if( $scope.todayVisitors > 0 ){
          $scope.referrals = Math.round((totalCnt / $scope.todayVisitors) * 100);
        } else {
          $scope.referrals = 0;
        }
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

        if (data && data.length > 0) {
          $scope.siteId = data[0].key;
        }

        getCurrentCustomer();
        todayCustomers();
        weeklyCustomers();
        getBrowserInfos();

      })
      .catch(function (err) {

      });


    // getReferSite();

  });

function createPieChart(data) {
  var pieChartCanvas = $("#pieChart").get(0).getContext("2d");

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

function createAreaChart(labels, datas){
    var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);
    var areaChartData = {
      labels: labels,
      datasets: [{
        label: "Weekly Visits",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: datas
      }]
    };
    var areaChartOptions = {
      //Boolean - If we should show the scale at all
      showScale: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: false,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - Whether the line is curved between points
      bezierCurve: true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.3,
      //Boolean - Whether to show a dot for each point
      pointDot: false,
      //Number - Radius of each point dot in pixels
      pointDotRadius: 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius: 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke: true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth: 2,
      //Boolean - Whether to fill the dataset with a color
      datasetFill: true,
      //String - A legend template
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
      //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: true,
      //Boolean - whether to make the chart responsive to window resizing
      responsive: true
    };
    //Create the line chart
    areaChart.Line(areaChartData, areaChartOptions);
}
