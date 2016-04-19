'use strict';

var _ = require('lodash');
var Channel = require('./channel.model');

exports.index = function (req, res) {
  var uid = req.user.uid;

  Channel.find({"uid": uid}, function (err, apps) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(apps);
  });
};

exports.search = function (req, res) {
  var origin = req.body.origin;
  var uid = req.user.uid;
  var activeYN = req.body.activeYN;

  var query = {
    uid: uid
  };

  if( activeYN ){
    if( activeYN == "N" ){
      query.active = false;
    } else {
      query.active = true;
    }
  }

  if( origin ){
    query.origin = origin;
  }

  Channel.find(query, function (err, channels) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(channels);
  });
};

exports.save = function (req, res) {
  var channel = req.body.channel;
  var name = req.body.name;
  var startTime = req.body.startTimestamp;
  var origin = req.body.origin;
  var data = req.body.data;
  var uid = req.body.uid;

  var saveData = {
    channel: channel,
    uid: uid
  };

  Channel.findOne(saveData, function (err, channel) {
    if (err) {
      console.log( err );
      return handleError(res, err);
    }
    if (!channel) {
      saveData.name = name;
      saveData.startTime = startTime;
      saveData.data = data;

      Channel.create(saveData, function (err, _channel) {
        if (err) {
          return handleError(res, err);
        } else {
          return res.status(200).json(_channel); 
        }
      });
    } else {
      channel.name = name;
      channel.startTime = startTime;
      channel.data = _.merge(channel.data, data);

      channel.save(function (err){
        if (err) return handleError(res, err);
        return res.status(200).json(channel);
      });
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

