'use strict';

var mongoose = require('mongoose'),
	uuid = require('node-uuid'),
    Schema = mongoose.Schema;

    var userSchema = new Schema({
      UID: { type: String, required: true, trim: true },
      ID: { type: String, required: true, trim: true }, // user id
      NM: { type: String, trim: true },                 // user name
      P :   { type: String, trim: true},                 // user picture
      R : {type: String, trim: true}
      //,status: { type: String, trim: true}  -- to redis db;
    });

   	var AppSchema = new Schema({
        users: [userSchema],
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
