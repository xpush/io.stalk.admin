'use strict';

var _ = require('lodash');
var App = require('./app.model');
var uuid = require('node-uuid');
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
      if (user.ID == req.user.login) {
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
  var userId = req.user.email;

  App.find({"users.ID": userId}, function (err, apps) {
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

  body.users = [{
    UID: user.uid,
    ID: user.email,
    NM: user.name,
    P: "",
    R: 'admin'
  }];

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
  App.findOne({key: key}, function (err, app) {
    if (err) {
      return handleError(res, err);
    }
    if (!app) {
      return res.send(404);
    }

    // no operator
    if (!app.users || app.users.length < 1) {
      return res.send(200).json({});
    }
    var oid = app.users[0].UID;

    request.post(
      'http://54.178.160.166:8000/user/active',
      {form: {A: 'stalk', U: oid}},
      function (error, response, result) {
        if (!error && response.statusCode == 200) {
          // user-register success
          var resData = JSON.parse(result);
          if ("ok" == resData.status) {
            if (!resData.result || !resData.result[oid]) return res.status(200).json({});
            return res.status(200).json(app.users[0]);
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
  return res.send(500, err);
}
