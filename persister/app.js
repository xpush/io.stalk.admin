'use strict';
var mongoose = require('mongoose');

var appModel = function () {

  var userSchema = mongoose.Schema({
    userId: { type: String, required: true, trim: true },
    userNm: { type: String, trim: true },
    pic :   { type: String, trim: true},
    status: { type: String, trim: true}
  });


  var appSchema = mongoose.Schema({
    users: [userSchema],
    app: String,
    url: String,
    key: String,
    name: String

  });

  return mongoose.model('App', appSchema);

};

module.exports = new appModel();