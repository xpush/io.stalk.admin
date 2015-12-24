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

exports.listByOrigin = function (req, res) {
  var origin = req.params.origin;
  var uid = req.body.uid;

  var query = {
    origin: origin,
    uid: uid
  };

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

  var saveData = {
    channel: channel
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

      console.log( saveData );

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

