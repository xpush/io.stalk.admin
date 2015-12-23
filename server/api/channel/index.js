'use strict';

var express = require('express');
var controller = require('./channel.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
router.post('/', auth.isAuthenticated(), controller.index);
router.post('/:origin', auth.isAuthenticated(), controller.listByOrigin);
router.put('/save', auth.isAuthenticated(), controller.save);

module.exports = router;
