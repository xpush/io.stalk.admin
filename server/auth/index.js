'use strict';

var express = require('express');
//var passport = require('passport');
var config = require('../config/environment');
var Auth = require('../api/auth/auth.model');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(Auth, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;