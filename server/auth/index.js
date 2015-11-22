'use strict';

var express = require('express');
//var passport = require('passport');
var config = require('../config/environment');
var Auth = require('../api/auth/auth.model');

// Passport Configuration
require('./local/passport').setup(Auth, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;