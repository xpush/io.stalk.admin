'use strict';

var _ = require('lodash');
var App = require('./app.model');
var Activity = require('./../activity/activity.model');
var Auth = require('../auth/auth.model');
var config = require('./../../config/environment');
var XPUSH = require("./../../xpush-node-client")(config.xpush);
var request = require('request');

exports.chooseApplication = function (req, res) {
  var key = req.body.key ? req.body.key : req.params.key ? req.params.key : undefined;
  App.findOne({key: key}, function (err, app) {
    if (err) {
      return res.json(401, err);
    }
    if (!app) {
      return res.json(404, 'does not exist');
    }
    app.users.forEach(function (user) {
      if (user == req.user.uid) {
        req.session.appKey = key;
        return res.json(200, app);
      }
    });
    if (!app) {
      return res.json(404, 'does not exist');
    }

  });
};

// Get list of apps
exports.index = function (req, res) {
  var userId = req.user.uid;

  App.find({"users": userId}, function (err, apps) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(apps);
  });
};

// Get a single app
exports.show = function (req, res) {
  App.findById(req.params.id, function (err, app) {
    if (err) {
      return handleError(res, err);
    }
    if (!app) {
      return res.send(404);
    }
    return res.json(app);
  });
};

// Creates a new app in the DB.
exports.create = function (req, res) {
  var body = req.body;

  var user = req.user;

  body.users = [user.uid];

  App.create(body, function (err, app) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(app);
  });
};

// Updates an existing app in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  App.findById(req.params.id, function (err, app) {
    if (err) {
      return handleError(res, err);
    }
    if (!app) {
      return res.send(404);
    }
    var updated = _.merge(app, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, app);
    });
  });
};

// Deletes a app from the DB.
exports.destroy = function (req, res) {
  App.findById(req.params.id, function (err, app) {
    if (err) {
      return handleError(res, err);
    }
    if (!app) {
      return res.send(404);
    }
    app.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

exports.operators = function (req, res) {
  var key = req.params.key;
  var clientIp = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  req.body.IP = clientIp;

  Activity.create(req.body, function (err, activity) {
    if (err) {
      return handleError(res, err);
    }
  });

  App.findOne({key: key}, function (err, app) {
    if (err) {
      return handleError(res, err);
    }

    if (!app) {
      return res.status(200).json({});
    }

    var referer = req.headers.referer;

    var url = app.url;

    // TODO ... referer가 없으면 조회 되지 않아야 한다.
    if (!referer || referer.indexOf(url) < 0) {

      return res.status(200).json({});
    }

    // no operator
    if (!app.users || app.users.length < 1) {
      return res.send(200).json({});
    }

    var oid = app.users[0];

    request.post(
      config.xpush.url + '/user/active',
      {form: {A: config.xpush.A, U: oid}},
      function (error, response, result) {

        if (!error && response.statusCode == 200) {
          // user-register success
          var resData = JSON.parse(result);
          if ("ok" == resData.status) {

            var returnJson = {};
            returnJson['app'] = config.xpush.A;
            returnJson['server'] = config.xpush.url;

            if (!resData.result || !resData.result[oid]) return res.status(200).json(returnJson);
            Auth.findOne({uid: oid}, {
              'name': 1,
              'image': 1,
              'email': '1',
              'uid': '1',
              '_id': '0'
            }).exec(function (err, user) {
              if (err) {
                console.log(err);
                return handleError(res, err);
              }

              if (user) {
                if (!user.image) {
                  user.image = 'https://raw.githubusercontent.com/xpush/io.stalk.admin/master/client/assets/images/face.png';
                }

                user._id = undefined;

                returnJson['operator'] = user;
                returnJson['clientIp'] = clientIp;
                return res.status(200).json(returnJson);
              }
            });
          } else if ("ERR-INTERNAL" == resData.status && "ERR-USER_EXIST" == resData.message) {
            return handleError(res, result);
          } else {
            return handleError(res, result);
          }
        } else {
          return handleError(res, error);
        }
      }
    );
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
