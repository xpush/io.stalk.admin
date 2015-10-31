'use strict';

var express = require('express');
var passport = require('passport');
var authService = require('../auth.service');
var AuthModel = require('./../../api/auth/auth.model');
var UT = require('./../../components/utils');
var DICT = require('./../../config/dict');


var router = express.Router();

router.post('/', function (req, res, next) {


  var email = req.body.email;
  var pass = req.body.password;

  var saveData = {
    email: email
  };

  AuthModel.findOne(saveData, function (err, auth) {
    if (err) {
      return handleError(res, err);
    }
    if (!auth) {
      return res.json({status: 'ERR-EMAIL', message: DICT.EMAIL_WRONG});
    }

    if (auth.active == false) {
      res.json({status: 'AUTH-DEACTIVE', message: DICT.EMAIL_DEACTIVE});
    }
    else if (auth.pass == UT.encrypto(pass)) {
      req.session.email = auth.email;
      req.session.name = auth.name;
	  //var token = authService.signToken(user._id, user.role);

	  passport.authenticate('local', function (err, user, info) {
	    var error = err || info;
	    if (error) return res.status(401).json(error);
	    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

	    var token = authService.signToken(user._id, user.role);
	    res.json({token: token});
	  })(req, res, next)



	    //res.json({token: token});
	    /*
      res.send({
        status: 'ok',
        result: {
          email: email
        }
      });
  */
    }
    else {
      res.send({status: 'ERR-PASSWORD', message: DICT.PASSWORD_WRONG});
    }
  })  


/*	
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next)
 */
});

module.exports = router;