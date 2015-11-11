'use strict';

var express = require('express');
var controller = require('./analytic.controller');

var router = express.Router();

router.post("/currentCustomers", controller.currentCustomers);

module.exports = router;