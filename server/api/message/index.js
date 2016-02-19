'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
router.post('/', auth.isAuthenticated(), controller.index);
router.post('/save', controller.save);
router.post('/read', auth.isAuthenticated(), controller.read);
router.post('/readAll', auth.isAuthenticated(), controller.readAll);

module.exports = router;
