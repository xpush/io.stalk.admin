'use strict';

var _ = require('lodash');
var App = require('../app/app.model');
var Message = require('./message.model');

exports.index = function (req, res) {

  var userId = req.user.uid;

  App.find({"users": userId}, function (err, apps) {
    if (err) {
      return handleError(res, err);
    }

    var appkeys = [];
    for( var jnx = 0 ; jnx < apps.length; jnx++){
      appkeys.push( apps[jnx].key );
    }

    var query = Message.find({"appkey": { $in:appkeys }, "unread": true, "message": { $exists: true } });
    query.exec(function (err, messages) {
      if (err) {
        return handleError(res, err);
      }

      return res.send(messages);
    });
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

exports.read = function (req, res) {
  var id = req.body.id;

  var reqData = {
    _id: id,
  };

  Message.update(reqData, {$set:{unread:false}}, {multi:true}, function (err, _message) {
    if (err) {
      return handleError(res, err);
    } else {
      return res.status(200).json({'status':'ok'}) ; 
    }
  });
};

exports.readAll = function (req, res) {
  var userId = req.user.uid;

  App.find({"users": userId}, function (err, apps) {
    if (err) {
      return handleError(res, err);
    }

    var appkeys = [];
    for( var jnx = 0 ; jnx < apps.length; jnx++){
      appkeys.push( apps[jnx].key );
    }

    var reqData = {
      unread: true,
      appkey: {$in:appkeys}
    };    

    console.log( reqData );

    Message.update(reqData, {$set:{unread:false}}, {multi:true}, function (err, _message) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.status(200).json({'status':'ok'}) ;
      }
    });
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
