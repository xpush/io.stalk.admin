'use strict';

var express = require('express');
var controller = require('./auth.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');


var router = express.Router();

router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/activate', controller.activate);
router.post('/reactivate', controller.reconfirm);

router.post('/signup', controller.create);
router.post('/signupdirect', controller.createDirect);

router.post('/signin', controller.signin);

router.get('/me', auth.isAuthenticated(), controller.me);

router.put('/:id', controller.update);
router.post('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/geo', controller.getGeoLocation);

// Session  서버 정보 가져오기!
router.get('/server', controller.getSessionServerUrl);

module.exports = router;
