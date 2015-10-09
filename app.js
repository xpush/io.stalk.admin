var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals')
var Database = require('./persister/database');
var config = require('./config.json');
var app = express();
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');






// uncomment after placing your favicon in /public

app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use(function(req, res, next) {

    if(req.user) res.locals.whoami = req.user.group;
    else res.locals.whoami = '';
    next();
});

require('./passport/pass')(passport);



Database.config(
  config && config.mongodb && config.mongodb.address ? config.mongodb.address : '', 'withtalk',
  
  config.mongodb && config.mongodb.options ? config.mongodb.options : undefined,
  function(err, message) {
    if (!err) console.info('  - Mongodb is connected');
  }
);
require('./routes/index')(app, passport, Database);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
