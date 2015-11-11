'use strict';

var express = require('express');
var controller = require('./analytic.controller');

var router = express.Router();

router.post("/currentCustomers", controller.currentCustomers);
router.post("/todayCustomers", controller.todayCustomers);
router.post("/getReferSite", controller.getReferSite);

module.exports = router;