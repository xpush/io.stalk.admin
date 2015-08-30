var LocalStrategy = require('passport-local').Strategy;
var User = require('../persister/user');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
            usernameField: 'email',
	        passReqToCallback : true
	  },
	  function(req, email, password, done) {
        console.log(email);
        console.log(password);

	    // check in mongo if a user with username exists or not
	    User.findOne({'group':req.param('group'), 'email' :  email },
	      function(err, user) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
              console.log(user);
	        if (!user){
	          console.log('User Not Found with email '+email);
	          return done(null, false, 
	                req.flash('message', 'User Not found.'));                 
	        }
	        // User exists but wrong password, log the error 
	        if (!isValidPassword(user, password)){
	          console.log('Invalid Password');
	          return done(null, false, 
	              req.flash('message', 'Invalid Password'));
	        }
	        // User and password both match, return user from 
	        // done method which will be treated like success

	        return done(null, user);
	      }
	    );
	}));

	passport.use('signup', new LocalStrategy({
            usernameField: 'email',
	        passReqToCallback : true
	  },
	  function(req, email, password, done) {


          findOrCreateUser = function(){
	      // find a user in Mongo with provided username


	      User.findOne({'group':req.param('group'),'email':email},function(err, user) {
	        // In case of any error return
	        if (err){
	          console.log('Error in SignUp: '+err);
	          return done(err);
	        }
	        // already exists
	        if (user) {
	          console.log('User already exists');
	          return done(null, false, 
	             req.flash('message','User Already Exists'));
	        } else {
	          // if there is no user with that email
	          // create the user
	          var newUser = new User();
	          // set the user's local credentials
              newUser.group = req.param("group");
	          newUser.username = req.param('username');
	          newUser.password = createHash(password);
	          newUser.email = email;
	          newUser.admin = false;

	 
	          // save the user
	          newUser.save(function(err) {
	            if (err){
	              console.log('Error in Saving user: '+err);  
	              throw err;  
	            }
	            console.log('User Registration succesful');    
	            return done(null, newUser);
	          });
	        }
	      });
	    };
	     
	    // Delay the execution of findOrCreateUser and execute 
	    // the method in the next tick of the event loop
	    process.nextTick(findOrCreateUser);
	  }));
	
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}	



var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}


// Generates hash using bCrypt
var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
