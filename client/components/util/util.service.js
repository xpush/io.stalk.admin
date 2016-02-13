'use strict';

angular.module('stalkApp')
  .factory('Util', function Util() {

    return {
      timeToString : function(timestamp){
        var cDate = new Date();

        var cYyyymmdd = cDate.getFullYear() + "" + (cDate.getMonth() + 1) + "" + cDate.getDate();
        var date = new Date(timestamp);

        var yyyy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        var hour = date.getHours();
        hour = hour >= 10 ? hour : "0" + hour;

        var minute = date.getMinutes();
        minute = minute >= 10 ? "" + minute : "0" + minute;

        var second = date.getSeconds();
        second = second >= 10 ? "" + second : "0" + second;

        var yyyymmdd = yyyy + "" + mm + "" + dd;

        var result = [];
        if (cYyyymmdd != yyyymmdd) {
          result.push(yyyy + "-" + mm + "-" + dd);
        } else {
          result.push(hour + ":" + minute + ":" + second);
        }

        result.push(yyyy + "." + mm + "." + dd);
        result.push(date.toLocaleTimeString());

        return result;  
      }
    };
  });