var User = require('../persister/user');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment-timezone');
var multer  = require('multer');


module.exports = function(app, passport, Database){
	
	 /* GET home page. */
	app.get('/', function(req, res) {
    res.render('index', {});
	});

  app.get('/link', function(req, res) {
    res.render('link', {});
  });

	app.post('/login', passport.authenticate('login', {
		successRedirect: '/checkin',
		failureRedirect: '/login',
		failureFlash : true 
	}));

	app.get('/login', function(req, res) {
	   res.render('login', { message: req.flash('message') });
	});

	app.get('/logout', function(req, res) {
	   req.logout();
  	 res.redirect('/');
	});
	
	
	app.get('/register', function(req, res){
		res.render('register',{ message: req.flash('message') });
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true 
	}));


  app.get('/readme',isAuthenticated, function(req, res) {
	   res.render('template/readme', {});
	});
	app.get('/dashboard',isAuthenticated, function(req, res) {
	   res.render('template/index', {});
	});
	app.get('/flot',isAuthenticated, function(req, res) {
	   res.render('template/flot', {});
	});
	app.get('/morris',isAuthenticated, function(req, res) {
	   res.render('template/morris', {});
	});
	app.get('/tables',isAuthenticated, function(req, res) {
	   res.render('template/tables', {});
	});
	app.get('/forms',isAuthenticated, function(req, res) {
	   res.render('template/forms', {});
	});
	app.get('/panelswells',isAuthenticated, function(req, res) {
	   res.render('template/panelswells', {});
	});
	app.get('/buttons',isAuthenticated, function(req, res) {
	   res.render('template/buttons', {});
	});
	app.get('/notifications',isAuthenticated, function(req, res) {
	   res.render('template/notifications', {});
	});
	app.get('/typography',isAuthenticated, function(req, res) {
	   res.render('template/typography', {});
	});
	app.get('/icons',isAuthenticated, function(req, res) {
	   res.render('template/icons', {});
	});
	app.get('/grid',isAuthenticated, function(req, res) {
	   res.render('template/grid', {});
	});
	app.get('/blank',isAuthenticated, function(req, res) {
	   res.render('template/blank', {});
	});
  app.get('/bbs',isAuthenticated, function(req, res) {
	   res.render('template/bbs', {});
	});

}
	// As with any middleware it is quintessential to call next()
	// if the user is authenticated
	var isAuthenticated = function (req, res, next) {
	  if (req.isAuthenticated())
	    return next();

        //return next();
	  res.redirect('/login');
	}


    // Generates hash using bCrypt
    var createHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }

