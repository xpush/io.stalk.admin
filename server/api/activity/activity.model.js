'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
	A: String,
	ENS: Date,
VID: String,
U: String,
REF: String,
CH: String,
IP: String,
CC: String,
CT: String,
RMT: Date,
SMT: Date,
LTS: Date,
OP: String
},{strict: false});

module.exports = mongoose.model('Activity', ActivitySchema);