'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  email: String,
  name: {type: String, default: "anonymous"},
  message: String,
  image: {type: String},
  unread: {type: Boolean, default: true},
  ts: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Message', MessageSchema);
