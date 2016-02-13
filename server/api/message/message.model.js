'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  email: String,
  name: {type: String, default: "anonymous"},
  url: String,
  appkey:String,
  message: String,
  image: {type: String},
  unread: {type: Boolean, default: true},
  timestamp: Number
});

module.exports = mongoose.model('Message', MessageSchema);
