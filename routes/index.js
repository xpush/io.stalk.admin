var Bbs = require('../persister/bbs');
var CheckIn = require('../persister/checkin');
var Dates = require('../persister/checked_date');
var User = require('../persister/user');
var LateComer = require('../persister/latecomer');
var bcrypt = require('bcrypt-nodejs');

var GoogleDrive = require('../lib/google-drive');

var moment = require('moment-timezone');
var multer  = require('multer');
var upload = multer({ dest: '../uploads/' });
var fs = require('fs');


module.exports = function(app, passport, Database){
	
	 /* GET home page. */
	app.get('/',isAuthenticated, function(req, res) {
	   res.redirect('/checkin');
	});

	app.post('/login', passport.authenticate('login', {
		successRedirect: '/checkin',
		failureRedirect: '/login',
		failureFlash : true 
	}));

	app.get('/login', function(req, res) {
	   res.render('template/login', { message: req.flash('message') });
	});

	app.get('/logout', function(req, res) {
	   req.logout();
  	 res.redirect('/');
	});
	
	
	app.get('/signup', function(req, res){
		res.render('template/signup',{ message: req.flash('message') });
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true 
	}));

  app.get('/myprofile', function(req,res){
      // check in mongo if a user with username exists or not
      var email = req.user.email;
      var group = req.user.group;
      User.findOne({'group':group,'email' :  email },{'password':0},
          function(err, user) {
            // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log error & redirect back

                res.send(user);
            }
        );
    });
    app.post('/myprofile/update', function(req,res){
        // check in mongo if a user with username exists or not
        var username = req.param('username');
        var newpassword = req.param('newpassword');

        var email = req.user.email;
        var group = req.user.group;
        User.findOne({'group':group,'email' :  email },
            function(err, user) {
                // In case of any error, return using the done rmethod
                if (err){
                    res.send({result:"FAIL"});
                }
                // Username does not exist, log error & redirect back

                user.username = username;

                if(req.param('check')){
                    user.password =createHash(newpassword);
                }

                user.save(function(err) {
                    if (err){
                        console.log('Error in Saving user: '+err);

                        res.redirect('back');
                    }
                    console.log("user saved");

                    res.redirect('/logout');
                });

            }
        );
    });

    app.get('/checkin',isAuthenticated, function(req, res) {

      console.log(moment().tz("Asia/Seoul").format('YYYY.MM.DD'));
        res.render('template/checkin', {error:"",now:moment().tz("Asia/Seoul").format('YYYY.MM.DD')});
    });
    app.get('/mycheckin',isAuthenticated, function(req, res) {
        res.render('template/checkinlist', {data:""});
    });


    app.post('/reply/create',isAuthenticated, function(req,res){
        var mongoid = req.param('mongoid');
        var comment = req.param('comment');
        var username = req.user.username;
        var email = req.user.email;

        var reply = new Object();
        var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');

        reply.mongoid = mongoid;
        reply.comment = comment;
        reply.username = username;
        reply.email = email;
        reply.date = momentDate;

        var query  = { _id: mongoid};
        var update = { '$addToSet': { reply: reply  }};
        CheckIn.update(query, update, { "multi": true }, function(err, data) {
            if (err){
                console.log('Find checkin error: '+err);
                res.send({"result":"FAIL"});
            }

            CheckIn.findOne(query,function(err,checkIn){
                // In case of any error, return using the done method
                if (err)
                  return done(err);
                res.send({"result":"SUCCESS","checkIn":checkIn});

            })



        });
    });
    app.post('/checkin/create',upload.single('uploadImage'), function(req, res) {
        var group = req.user.group;

        var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');
        var fileId = "";
        var point = req.param('point');
        if(point==null||point==""){
          res.render('template/checkin', {error:"Error in Saving checkin",now:moment().tz("Asia/Seoul").format('YYYY.MM.DD')});
          return;
        }

        if(req.file){
          var originalname = req.file.originalname;
          var path = req.file.path;
          var filename = req.file.filename;
          console.log(req.file);


          var folderId = "0ByYvAjjPTkj3fkxkTW80cHpLaEVBbENDWmh6dHFqSGlqN0VSczBQMDlaak9kcmRmYWtZSXM";
          var folderName = "checkin";

          fileId = filename+"_"+originalname;

          var googleDrive = new GoogleDrive(folderId, folderName, fileId);
          googleDrive.write(path,req.file.mimetype,function(){
            createCheckin(req,res,momentDate,fileId);
          });



          //var gfs = Database.getGfs();
          //
          //var writestream = gfs.createWriteStream({
          //  filename: originalname
          //});
          //fs.createReadStream(path).pipe(writestream);
          //writestream.on('close', function (file) {
          //  // do something with `file`
          //  console.log(file.filename + 'Written To DB');
          //
          //  fs.unlink(path, function (err) {
          //    if (err) throw err;
          //    console.log('successfully deleted '+path);
          //  });
          //
          //  fileId = file._id;
          //
          //  createCheckin(req,res,momentDate,fileId);
          //});
        }else{
          createCheckin(req,res,momentDate,fileId);
        }
    });

    function createCheckin(req,res,momentDate,fileId){
      var newCheckIn = new CheckIn();

      CheckIn.findOne({ group:req.user.group,date:momentDate, email:req.user.email },function(err,checkIn){

        if(checkIn ){
          checkIn.remove();
        }

      })//.remove().exec();
      // set the user's local credentials

      newCheckIn.group = req.user.group;
      newCheckIn.point = req.param('point');
      newCheckIn.negative = req.param('negative');
      newCheckIn.positive = req.param('positive');
      newCheckIn.date = momentDate;
      newCheckIn.email = req.user.email;
      newCheckIn.username = req.user.username;
      newCheckIn.fileId = fileId;

      // save the user
      newCheckIn.save(function(err) {
        if (err){
          console.log('Error in Saving checkin: '+err);
          res.render('template/checkin', {error:"Error in Saving checkin",now:moment().tz("Asia/Seoul").format('YYYY.MM.DD')});
        }
        res.render('template/checkinlist', {data:"success"});

      });

      Dates.findOne({group:req.user.group,date:momentDate},
        function(err, dates) {
          // In case of any error, return using the done method
          if (err)
            return done(err);
          if(dates==null){
            var newDates = new Dates();
            newDates.date = momentDate;
            newDates.group = req.user.group;
            newDates.save(function(err){
              console.log("saved dates");
            })
          }
        }
      );
    };

    app.get('/file/:id',function(req,res){
      var pic_id = req.param('id');

      var gfs = Database.getGfs();

      gfs.findOne({ _id: pic_id}, function (err, file) {

        if (err) return res.status(400).send(err);


        res.writeHead(200, { 'Content-Type': file.contentType });

        var readstream = gfs.createReadStream({
          _id: pic_id
        });

        readstream.pipe(res);

      });

    });

    app.get('/checkin/list',isAuthenticated, function(req, res) {

        CheckIn.find({group:req.user.group,email:req.user.email}).sort({date:-1}).exec(
            function(err, checkin) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                res.send({"checkin":checkin});
            }
        );
    });
    app.post('/checkin/delete',isAuthenticated, function(req, res) {
        // set the user's local credentials
        var id = req.param('id');
        CheckIn.findByIdAndRemove(id,function(err){
            if (err){
                console.log('Error in Deleting checkin: '+err);
                res.send({"result":"FAIL"});
            }
            res.send({"result":"SUCCESS"});
        })
    });

	app.get('/letscheck',isAuthenticated, function(req, res) {

        console.log(req.user);
        Dates.find({group:req.user.group},{date:1,_id:0}).sort({date:-1}).exec(
            function(err, checkin) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                console.log(checkin);
                res.render('template/letscheck', {"checkinDate":checkin});
            }
        );

	});
    app.get('/letscheck/list',isAuthenticated, function(req, res) {


        CheckIn.find({group:req.user.group,date:req.param('date')}).sort({point:-1,username:1}).exec(
            function(err, checkin) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                res.send({"checkin":checkin});
            }
        );
    });

    app.get('/letscheck/list/last',isAuthenticated, function(req, res) {

        var selected_date = req.param('date');

        Dates.find({group:req.user.group,date:{$lt:selected_date}}).sort({date:-1}).limit(1).exec(
            function(err, date) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);

                if(date.length>0){
                    for(var i in date){

                        var before_date = date[i].date;
                        CheckIn.find({group:req.user.group,date:before_date}).sort({point:-1}).exec(
                            function(err, checkin) {
                                // In case of any error, return using the done method
                                if (err)
                                    return done(err);
                                res.send({"last_checkin":checkin,"before_date":before_date});
                            }
                        );
                    }
                }else{
                    res.send({"last_checkin":[],"before_date":""});
                }
            }
        );
    });
  app.get('/timer',isAuthenticated, function(req, res) {
     res.render('template/timer', {});
  });
  app.get('/beep',isAuthenticated, function(req, res) {
     res.render('template/boozer', {});
  });
  app.get('/latecomer',isAuthenticated, function(req, res) {
     res.render('template/latecomer', {now:moment().tz("Asia/Seoul").format('YYYY.MM.DD'),admin:req.user.admin});
  });
  app.get('/latecomer/list',isAuthenticated,
    function(req, res) {
      var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');

      var userList = [];
      User.find({'group':req.user.group},{'password':0},
        function(err, user) {
          // In case of any error, return using the done method
          if (err)
              return done(err);
          // Username does not exist, log error & redirect back


          user.forEach(function(u,i){

            getLateUser(u, momentDate, i,user.length, function(_i,_size, later){
              userList.push(later);
              // Username does not exist, log error & redirect back
              if(user.length==userList.length){
                res.send({"user":userList});
              }

            });
          })
        });
  });

  function getLateUser(user, date,  index,size, callback){

    LateComer.findOne({ group:user.group,date:date, email:user.email},{email:1},
    function(err, latecomer) {
      // In case of any error, return using the done method
      if (err)
        return done(err);

      var temp ={username: user.username,
        email: user.email,
        late:false};

      if(latecomer){
        temp['late'] = true;
      }

      callback(index,size, temp);

    });
  }

  app.post('/latecomer/create',isAuthenticated, function(req, res) {
    var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');
    LateComer.findOne({ group:req.user.group,date:momentDate, email:req.param('email') },function(err, latecomer) {
      // In case of any error, return using the done method
      if (err)
        return done(err);
      // Username does not exist, log error & redirect back
      if(!latecomer){
        var newLateComer = new LateComer();

        newLateComer.email = req.param('email');
        newLateComer.group = req.user.group;
        newLateComer.date =momentDate;

        // save the user
        newLateComer.save(function(err) {
          if (err){
            console.log('Error in Saving bbs: '+err);
            res.send({"result":false});
          }
          res.send({"result":true});
        });
      }else{
        res.send({"result":true});
      }

    })

  });
  app.post('/latecomer/delete',isAuthenticated, function(req, res) {
    // set the user's local credentials
    var email = req.param('email');
    var group = req.user.group;
    var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');

    LateComer.findOne({ group:req.user.group,date:momentDate, email:email }).remove().exec();
    res.send({"result":true});
  });

  app.get('/latecomer/dashboard',isAuthenticated,
  function(req, res) {
    var momentDate = moment().tz("Asia/Seoul").format('YYYY.MM.DD');

    var userList = [];
    User.find({'group':req.user.group},{'password':0},
    function(err, user) {
      // In case of any error, return using the done method
      if (err)
        return done(err);
      // Username does not exist, log error & redirect back


      user.forEach(function(u,i){

        getLateHistory(u,i,function(_i, later){
          userList.push(later);
          // Username does not exist, log error & redirect back
          if(user.length==userList.length){
            res.send({"user":userList});
          }
        })
      })
    });
  });
  function getLateHistory(user, index, callback){

    LateComer.find({ group:user.group, email:user.email},{date:1},
    function(err, latecomer) {
      // In case of any error, return using the done method
      if (err)
        return done(err);

      var temp ={username: user.username,
        email: user.email,
        late:latecomer};

      callback(index, temp);
    });
  }

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
	
	app.get('/bbs/list',isAuthenticated, function(req, res) {
		 Bbs.find({}, 
	      function(err, bbs) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
	        res.send(bbs);
	      }
	    );
	});

	app.post('/bbs/create',isAuthenticated, function(req, res) {
		
		var newBbs = new Bbs();
		// set the user's local credentials
		newBbs.content = req.param('content');
		newBbs.vote = 0;
		newBbs.username = req.user.username;
		
		// save the user
		newBbs.save(function(err) {
			if (err){
			  console.log('Error in Saving bbs: '+err);  
			  res.send({"result":false});
			}
			res.send({"result":true});
		});
	});

	app.post('/bbs/delete',isAuthenticated, function(req, res) {
		// set the user's local credentials
		var id = req.param('id');
		Bbs.findByIdAndRemove(id,function(err){
			if (err){
			  console.log('Error in Saving bbs: '+err);  
			  res.send({"result":false});
			}


			res.send({"result":true});
		})

		
	});
	app.post('/bbs/update',isAuthenticated, function(req, res) {
		// set the user's local credentials
		var id = req.param('id');

		Bbs.findById(id,function(err,bbs){
			if (err){
			  console.log('Error in Saving bbs: '+err);  
			  res.send({"result":false});
			}
			bbs.vote +=1;
			bbs.save(function(){
				res.send({"result":true});	
			})
			
		})
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

