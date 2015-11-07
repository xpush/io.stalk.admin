'use strict';

var _ = require('lodash');
var Activity = require('./activity.model');

// Get list of activitys
exports.index = function(req, res) {
  Activity.find(function (err, activitys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(activitys);
  });
};

// Get a single activity
exports.show = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    return res.json(activity);
  });
};

// Creates a new activity in the DB.
exports.create = function(req, res) {
  Activity.create(req.body, function(err, activity) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(activity);
  });
};

// Updates an existing activity in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Activity.findById(req.params.id, function (err, activity) {
    if (err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    var updated = _.merge(activity, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(activity);
    });
  });
};

// Deletes a activity from the DB.
exports.destroy = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    activity.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}