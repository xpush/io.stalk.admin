/**
 * Populate DB with initial data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var config = require('./environment');
var XPUSH = require("../xpush-node-client")(config.xpush);
var UT = require('../components/utils');

var App = require('../api/app/app.model');
var Auth = require('../api/auth/auth.model');

var UID_USER = 'U0000000-0000-0000-0000-00000000000U';
var KEY_SITE = 'A0000000-0000-0000-0000-00000000000A';

/* STEP 1. Create administrator account */

Auth.find({uid: UID_USER}).remove(function () {
  Auth.create({
      "uid": UID_USER,
      "name": "Administrator",
      "email": "admin@localhost",
      "pass": "ma5LqSpMG5SI+WihFajWpbBzXqLCeD+ifBH25YXHm5U=", // password('admin')
      "image": "https://raw.githubusercontent.com/xpush/io.stalk.admin/master/client/assets/images/face.png",
      "active": true
    }, function (err, auth) {

      if (err) {
        console.error(err);
      } else {

        /* STEP 2. Create administrator account on XPUSH */

        XPUSH.signup(auth.uid, UT.encrypto(auth.uid), "WEB", function () {

          /* STEP 3. Create a site on localhost */

          App.find({key: KEY_SITE}).remove(function () {
            App.create({
              "key": KEY_SITE,
              "name": "Localhost",
              "url": "http://localhost",
              "users": [
                UID_USER
              ]
            }, function (err, app) {
              if (err) {
                console.error(err);
              }

            });
          });

        });
      }
    }
  );
});