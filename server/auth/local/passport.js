var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var DICT = require('./../../config/dict');
var UT = require('./../../components/utils');


exports.setup = function (Auth, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      Auth.findOne({
        email: email.toLowerCase()
      }, function(err, auth) {
        if (err) return done(err);



        if (!auth) {
          return done(null, false, { message: DICT.EMAIL_WRONG });
        }
        if(auth.active == false){
          return done({ status: 'AUTH-DEACTIVE', message: DICT.EMAIL_DEACTIVE });
        }
        if(!auth.pass == UT.encrypto(password) ){
          return done(null, false, { message: DICT.PASSWORD_WRONG });
        }


        return done(null, auth);
      });
    }
  ));
};