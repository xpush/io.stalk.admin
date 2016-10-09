'use strict';

var express = require('express');
var controller = require('./analytic.controller');

var router = express.Router();

router.post("/currentCustomers", controller.currentCustomers);
router.post("/todayCustomers", controller.todayCustomers);
router.post("/weeklyCustomers", controller.weeklyCustomers);
router.post("/weeklyChatClosed", controller.weeklyChatClosed);
router.post("/weeklyCustomerLatency", controller.weeklyCustomerLatency);
router.post("/getReferSites", controller.getReferSites);
router.post("/getBrowserInfos", controller.getBrowserInfos);
router.post("/completeChattings", controller.completeChattings);

module.exports = router;
