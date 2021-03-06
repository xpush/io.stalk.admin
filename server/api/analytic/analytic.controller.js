'use strict';

var _ = require('lodash');
var Analytic = require('./analytic.model');
var Activity = require("./../activity/activity.model");

// Get list of analytics
exports.index = function(req, res) {
  Analytic.find(function (err, analytics) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(analytics);
  });
};

// Get a single analytic
exports.show = function(req, res) {
  Analytic.findById(req.params.id, function (err, analytic) {
    if(err) { return handleError(res, err); }
    if(!analytic) { return res.status(404).send('Not Found'); }
    return res.json(analytic);
  });
};

// Creates a new analytic in the DB.
exports.create = function(req, res) {
  Analytic.create(req.body, function(err, analytic) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(analytic);
  });
};

// Updates an existing analytic in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Analytic.findById(req.params.id, function (err, analytic) {
    if (err) { return handleError(res, err); }
    if(!analytic) { return res.status(404).send('Not Found'); }
    var updated = _.merge(analytic, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(analytic);
    });
  });
};

// Deletes a analytic from the DB.
exports.destroy = function(req, res) {
  Analytic.findById(req.params.id, function (err, analytic) {
    if(err) { return handleError(res, err); }
    if(!analytic) { return res.status(404).send('Not Found'); }
    analytic.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

exports.currentCustomers = function(req, res){
  Activity.find({A: req.body.A, LTS : {"$exists": false} }, function(err, activity){
    if(err) { return handleError(res, err); }
    return res.status(200).json({count: activity.length});
  });
}

exports.todayCustomers = function(req, res){

  var today = new Date();
  today.setHours(0); today.setMinutes(0);
  var year = 1900 + today.getYear();
  var month = today.getMonth();
  var day = today.getDate();
  today = today.toISOString().substring(0, 19);
  Activity.find({"ENS": { "$gte" : today} }, function(err, activity){
    if(err) { return handleError(res, err); }
    return res.status(200).json({count: activity.length});
  });
}

exports.weeklyCustomers = function(req, res){

  var today = new Date();
  today.setHours(0); today.setMinutes(0);today.setSeconds(0);

  var dateMap = {};
  for( var inx  = 7 ; inx >= 1 ;  inx-- ){
    var tmpDate = new Date(today);
    tmpDate.setDate( today.getDate() - inx );
    tmpDate = tmpDate.toISOString().substring(0, 10);
    dateMap[tmpDate] = true;
  }

  var start_date = new Date(today);
  start_date.setDate( today.getDate() - 7 );
  start_date  = start_date.toISOString().substring(0, 19);

  var end_date = new Date(today);
  end_date  = end_date.toISOString().substring(0, 19);

  Activity.aggregate([
        {$match: {$and: [{'ENS' : {"$exists": true}}, {'ENS': {$gte: start_date}}, {'ENS': {$lte: end_date}}]}},
        {$group: {
            _id: {$substr : ["$ENS",0, 10]},
            count: {$sum: 1}
        }},
        {$project: {
            date: "$_id", // so this is the shorter way
            count: 1,
            _id: 0
        }},
        {$sort: {"date": 1} } // and this will sort based on your date
    ], function(err, activitys){

      var result = [];
      var resultMap = {};
      for( var key in activitys ){
        result.push( activitys[key] );
        var date = activitys[key].date;
        resultMap[date] = true;
      }

      for( var key in dateMap ){
        if( !resultMap[key] ){
          result.push( {"count":0, "date": key } );
        }
      }

      result.sort(function(a, b){
        return a.date > b.date
      });

      console.log( result );

      return res.status(200).json(result);
    });
}

exports.weeklyChatClosed = function(req, res){

  var today = new Date();
  today.setHours(0); today.setMinutes(0);today.setSeconds(0);

  var dateMap = {};
  for( var inx  = 7 ; inx >= 1 ;  inx-- ){
    var tmpDate = new Date(today);
    tmpDate.setDate( today.getDate() - inx );
    tmpDate = tmpDate.toISOString().substring(0, 10);
    dateMap[tmpDate] = true;
  }

  var start_date = new Date(today);
  start_date.setDate( today.getDate() - 7 );
  start_date  = start_date.toISOString().substring(0, 19);

  var end_date = new Date(today);
  end_date  = end_date.toISOString().substring(0, 19);

  Activity.aggregate([
        {$match: {$and: [{'ENS' : {"$exists": true}}, {'SMT' : {"$exists": true}}, {'RMT' : {"$exists": true}}, {'ENS': {$gte: start_date}}, {'ENS': {$lte: end_date}}]}},
        {$group: {
            _id: {$substr : ["$ENS",0, 10]},
            count: {$sum: 1}
        }},
        {$project: {
            date: "$_id", // so this is the shorter way
            count: 1,
            _id: 0
        }},
        {$sort: {"date": 1} } // and this will sort based on your date
    ], function(err, activitys){

      var result = [];
      var resultMap = {};
      for( var key in activitys ){
        result.push( activitys[key] );
        var date = activitys[key].date;
        resultMap[date] = true;
      }

      for( var key in dateMap ){
        if( !resultMap[key] ){
          result.push( {"count":0, "date": key } );
        }
      }

      result.sort(function(a, b){
        return a.date > b.date
      });

      console.log( result );

      return res.status(200).json(result);
    });
}

exports.weeklyCustomerLatency = function(req, res){

  var today = new Date();
  today.setHours(0); today.setMinutes(0);today.setSeconds(0);

  var dateMap = {};
  for( var inx  = 7 ; inx >= 1 ;  inx-- ){
    var tmpDate = new Date(today);
    tmpDate.setDate( today.getDate() - inx );
    tmpDate = tmpDate.toISOString().substring(0, 10);
    dateMap[tmpDate] = true;
  }

  var start_date = new Date(today);
  start_date.setDate( today.getDate() - 7 );
  start_date  = start_date.toISOString().substring(0, 19);

  var end_date = new Date(today);
  end_date  = end_date.toISOString().substring(0, 19);

  Activity.aggregate([
        {$match: {$and: [{'ENS' : {"$exists": true}}, {'CLT' : {"$exists": true}}, {'ENS': {$gte: start_date}}, {'ENS': {$lte: end_date}}]}},
        {$group: {
            _id: {$substr : ["$ENS",0, 10]},
            average: {$avg:"$CLT" }
        }},
        {$project: {
            date: "$_id",
            average: 1,
            _id: 0
        }},
        {$sort: {"date": 1} } // and this will sort based on your date
    ], function(err, activitys){

      var result = [];
      var resultMap = {};
      for( var key in activitys ){
        result.push( activitys[key] );
        var date = activitys[key].date;
        resultMap[date] = true;
      }

      for( var key in dateMap ){
        if( !resultMap[key] ){
          result.push( {"average":0, "date": key } );
        }
      }

      result.sort(function(a, b){
        return a.date > b.date
      });

      return res.status(200).json(result);
  });
}

exports.getReferSites = function(req, res){
  Activity.aggregate([ { $match: {} },{ $group : { _id : "$REF" ,count: { $sum: 1 }  } }]).match( {_id:{$nin:['undefined','null']}} ).sort({count:-1}).limit(10).exec( function(err, activity){
    if(err) { return handleError(res, err); }
    return res.status(200).json(activity)
  });
}

exports.getBrowserInfos = function(req, res){
  Activity.aggregate([ { $match: {} },{ $group : { _id : "$BR" ,count: { $sum: 1 }  } } ], function(err, activity){
    if(err) { return handleError(res, err); }
    return res.status(200).json(activity);
  });
}

exports.completeChattings = function(req, res){
  Activity.find({A: req.body.A, LTS : {"$exists": false} }, function(err, activity){
    if(err) { return handleError(res, err); }
    return res.status(200).json({count: activity.length});
  });
}

