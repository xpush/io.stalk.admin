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

