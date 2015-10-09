var User = require('../persister/user');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment-timezone');
var multer  = require('multer');


module.exports = function(app, passport, Database){
	
	 /* GET home page. */
	app.get('/', function(req, res) {
    res.redirect('/dashboard');
	});

  app.get('/dashboard', function(req, res) {
    res.render('dashboard', {});
  });

  app.get('/site', function(req, res) {


    var sites = [{site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.14"},
                 {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.15"},
                 {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.16"}];

    res.render('site', {sites:sites});
  })

  app.get('/sitelist',function(req,res){
    var sites = [{site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.14"},
      {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.15"},
      {site_name:"Tistory",site_url:"www.tistory.com",site_code:"1q2w3e",date:"2014.04.16"}];
    res.send(sites);
  });
  app.post('/site', function(req, res) {

    var site_name = req.body['site_name'];
    var site_url = req.body['site_url'];
    console.log(site_name);
    console.log(site_url);

    res.send({result:true});
  })



  app.get('/link', function(req, res) {
    res.render('link', {});
  });

	app.post('/login', passport.authenticate('login', {
		successRedirect: '/link',
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

    var usertoken = req.query["usertoken"];
    console.log(usertoken);

    //@TODO FIND TEMPORARY USER INFO by usertoken

    var username = "John Ko";
    var useremail = "eunsan.ko@gmail.com";

    if(username!="" && username!=null){
      res.render('register',{ username: username, useremail:useremail , message: req.flash('message')});
    }else{
      res.render('registerEmail',{message: req.flash('message')});
    }
	});

	app.get('/registerEmail', function(req, res){
		res.render('registerEmail',{ message: req.flash('message') });
	});

  app.post('/register', function(req,res){
    var username = req.body['username'];
    var useremail = req.body['useremail'];

    console.log(username);
    console.log(useremail);

    //@TODO SEND EMAIL

    res.render('sendemail', { username: username, useremail:useremail});
  });



	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/register',
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

