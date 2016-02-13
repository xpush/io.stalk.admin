'use strict';

var _ = require('lodash');
var Message = require('./message.model');

exports.index = function (req, res) {

  var query = Message.find({"unread": true, "message": { $exists: true } }).select({"_id": 0});
  query.exec(function (err, messages) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(messages);
  });
};

exports.save = function (req, res) {
  var message = req.body.message;
  var email = req.body.email;
  var name = req.body.name;
  var appkey = req.body.appkey;
  var url = req.body.url;
  var timestamp = Date.now();

  var saveData = {
    appkey: appkey,
    url:url,
    name: name,
    message: message,
    email: email,
    timestamp: timestamp
  };

  Message.create(saveData, function (err, _message) {
    if (err) {
      return handleError(res, err);
    } else {
      _message._id = undefined;
      _message.__v = undefined;
      return res.status(200).json(_message); 
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}