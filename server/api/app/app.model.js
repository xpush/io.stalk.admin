'use strict';

var mongoose = require('mongoose'),
  uuid = require('node-uuid'),
  Schema = mongoose.Schema;

var AppSchema = new Schema({
  users: [String],
  app: String,
  url: String,
  key: {type: String, default: uuid.v1()},
  name: String
});
/*
 var AppSchema = new Schema({
 name: String,
 info: String,
 active: Boolean
 });
 */
module.exports = mongoose.model('App', AppSchema);
