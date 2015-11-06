'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AuthSchema = new Schema({
  email: String,
  name: {type: String, default: "anonymous"},
  uid: String,
  pass: {type: String, default: undefined},
  active: {type: Boolean, default: false},
  image: {type: String },
  ts: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Auth', AuthSchema);
